"""Deterministic, read-only semantic validation for parsed IRAC documents."""

from __future__ import annotations

from collections import Counter, defaultdict
from dataclasses import dataclass
from typing import Literal

from cpmoakb.parsers.models import IRACDocument, IRACNode


Severity = Literal["error", "warning"]


@dataclass(frozen=True, slots=True)
class ValidationFinding:
    """One deterministic semantic validation result."""

    rule_id: str
    severity: Severity
    message: str
    node_identifier: str | None = None
    parent_identifier: str | None = None


_EXPECTED_PARENT_LEVEL = {2: 1, 3: 2}
_IRAC_V11_5_COUNTS = {
    "total_nodes": 376,
    "moa_groups": 42,
    "chemical_classes": 64,
    "active_ingredients": 270,
}


def validate_irac_document(document: IRACDocument | None) -> list[ValidationFinding]:
    """Return semantic findings without changing the document or accessing files."""

    findings: list[ValidationFinding] = []
    if document is None:
        return [_finding("document.missing", "IRAC document does not exist.")]

    nodes = getattr(document, "nodes", None)
    if nodes is None:
        return [_finding("document.nodes_missing", "IRAC document node collection does not exist.")]

    node_list = list(nodes)
    code_counts = Counter(node.code for node in node_list if not _is_blank(node.code))
    nodes_by_code: dict[str, IRACNode] = {}
    for node in node_list:
        if not _is_blank(node.code) and node.code not in nodes_by_code:
            nodes_by_code[node.code] = node

    for node in node_list:
        identifier = None if _is_blank(node.code) else node.code
        if identifier is None:
            findings.append(_finding("node.identifier_required", "Node identifier is empty."))
        if node.level not in (1, 2, 3):
            findings.append(
                _finding(
                    "node.level_unrecognized",
                    f"Node {identifier or '<empty>'} has unrecognized hierarchy level {node.level!r}.",
                    identifier,
                )
            )
        if _is_blank(node.name):
            findings.append(
                _finding(
                    "value.name_required",
                    f"Node {identifier or '<empty>'} at level {node.level!r} has an empty name.",
                    identifier,
                )
            )

        if node.level == 1:
            if node.parent_code is not None:
                findings.append(
                    _finding(
                        "parent.root_forbidden",
                        f"MoA group {identifier or '<empty>'} must be a root node.",
                        identifier,
                        node.parent_code,
                    )
                )
            continue

        expected_parent_level = _EXPECTED_PARENT_LEVEL.get(node.level)
        if expected_parent_level is None:
            continue
        if _is_blank(node.parent_code):
            findings.append(
                _finding(
                    "parent.required",
                    f"Level {node.level} node {identifier or '<empty>'} requires a parent identifier.",
                    identifier,
                )
            )
            continue
        if node.parent_code == node.code:
            findings.append(
                _finding(
                    "parent.self_reference",
                    f"Node {identifier} cannot reference itself as its parent.",
                    identifier,
                    node.parent_code,
                )
            )
        parent = nodes_by_code.get(node.parent_code)
        if parent is None:
            findings.append(
                _finding(
                    "parent.not_found",
                    f"Node {identifier or '<empty>'} references missing parent {node.parent_code}.",
                    identifier,
                    node.parent_code,
                )
            )
        elif parent.level != expected_parent_level:
            findings.append(
                _finding(
                    "parent.level_invalid",
                    f"Level {node.level} node {identifier or '<empty>'} requires a level "
                    f"{expected_parent_level} parent; {node.parent_code} is level {parent.level!r}.",
                    identifier,
                    node.parent_code,
                )
            )

    for code, count in code_counts.items():
        if count > 1:
            findings.append(
                _finding(
                    "node.identifier_duplicate",
                    f"Node identifier {code} occurs {count} times.",
                    code,
                )
            )

    findings.extend(_cycle_findings(nodes_by_code))
    findings.extend(_duplicate_semantic_findings(node_list))
    return sorted(findings, key=_finding_sort_key)


def validate_irac_v11_5(document: IRACDocument | None) -> list[ValidationFinding]:
    """Validate semantics plus the registered canonical IRAC v11.5 counts."""

    findings = validate_irac_document(document)
    if document is None or getattr(document, "nodes", None) is None:
        return findings

    nodes = list(document.nodes)
    actual = {
        "total_nodes": len(nodes),
        "moa_groups": sum(node.level == 1 for node in nodes),
        "chemical_classes": sum(node.level == 2 for node in nodes),
        "active_ingredients": sum(node.level == 3 for node in nodes),
    }
    for label, expected in _IRAC_V11_5_COUNTS.items():
        if actual[label] != expected:
            findings.append(
                _finding(
                    f"canonical.v11_5.count.{label}",
                    f"IRAC v11.5 {label} count is {actual[label]}; expected {expected}.",
                )
            )
    return sorted(findings, key=_finding_sort_key)


def _cycle_findings(nodes_by_code: dict[str, IRACNode]) -> list[ValidationFinding]:
    cycles: set[tuple[str, ...]] = set()
    for start in sorted(nodes_by_code):
        path: list[str] = []
        positions: dict[str, int] = {}
        current: str | None = start
        while current in nodes_by_code and current not in positions:
            positions[current] = len(path)
            path.append(current)
            parent = nodes_by_code[current].parent_code
            if _is_blank(parent) or parent == current:
                current = None
                break
            current = parent
        if current is not None and current in positions:
            cycle = path[positions[current] :]
            rotations = [tuple(cycle[index:] + cycle[:index]) for index in range(len(cycle))]
            cycles.add(min(rotations))

    return [
        _finding(
            "parent.cycle",
            f"Parent cycle detected: {' -> '.join(cycle + (cycle[0],))}.",
            cycle[0],
            nodes_by_code[cycle[0]].parent_code,
        )
        for cycle in sorted(cycles)
    ]


def _duplicate_semantic_findings(nodes: list[IRACNode]) -> list[ValidationFinding]:
    findings: list[ValidationFinding] = []
    groups: defaultdict[str, list[IRACNode]] = defaultdict(list)
    class_identifiers: defaultdict[tuple[str | None, str], list[IRACNode]] = defaultdict(list)
    classes: defaultdict[tuple[str | None, str], list[IRACNode]] = defaultdict(list)
    ingredients: defaultdict[tuple[str | None, str], list[IRACNode]] = defaultdict(list)

    for node in nodes:
        if node.level == 1 and not _is_blank(node.code):
            groups[node.code].append(node)
        elif node.level == 2:
            if not _is_blank(node.code):
                class_identifiers[(node.parent_code, node.code)].append(node)
            if not _is_blank(node.name):
                classes[(node.parent_code, node.name)].append(node)
        elif node.level == 3 and not _is_blank(node.name):
            ingredients[(node.parent_code, node.name)].append(node)

    for code, duplicates in groups.items():
        if len(duplicates) > 1:
            findings.append(
                _finding(
                    "semantic.group_code_duplicate",
                    f"MoA group code {code} occurs {len(duplicates)} times.",
                    code,
                )
            )
    for (parent, code), duplicates in class_identifiers.items():
        if len(duplicates) > 1:
            findings.append(
                _finding(
                    "semantic.class_identifier_duplicate",
                    f"Chemical class identifier {code} occurs {len(duplicates)} times within parent {parent!r}.",
                    code,
                    parent,
                )
            )
    for (parent, name), duplicates in classes.items():
        if len(duplicates) > 1:
            findings.append(
                _finding(
                    "semantic.class_duplicate",
                    f"Chemical class name {name!r} occurs {len(duplicates)} times within parent {parent!r}.",
                    min(node.code for node in duplicates),
                    parent,
                )
            )
    for (parent, name), duplicates in ingredients.items():
        if len(duplicates) > 1:
            findings.append(
                _finding(
                    "semantic.ingredient_duplicate",
                    f"Active ingredient name {name!r} occurs {len(duplicates)} times within parent {parent!r}.",
                    min(node.code for node in duplicates),
                    parent,
                )
            )
    return findings


def _is_blank(value: object) -> bool:
    return not isinstance(value, str) or not value.strip()


def _finding(
    rule_id: str,
    message: str,
    node_identifier: str | None = None,
    parent_identifier: str | None = None,
) -> ValidationFinding:
    return ValidationFinding(rule_id, "error", message, node_identifier, parent_identifier)


def _finding_sort_key(finding: ValidationFinding) -> tuple[str, str, str, str, str]:
    return (
        finding.rule_id,
        finding.node_identifier or "",
        finding.parent_identifier or "",
        finding.severity,
        finding.message,
    )

"""Semantic validation tests for parsed IRAC documents."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import pytest

from cpmoakb.parsers.irac_parser import parse_irac_pdf
from cpmoakb.parsers.models import IRACDocument, IRACNode
from cpmoakb.validation import validate_irac_document, validate_irac_v11_5

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "official" / "IRAC" / "source_manifest.yaml"
GOLDEN_DIR = ROOT / "tests" / "golden" / "irac_v11_5"


def _document(*nodes: IRACNode) -> IRACDocument:
    return IRACDocument(version="test", nodes=nodes)


def _valid_nodes() -> tuple[IRACNode, ...]:
    return (
        IRACNode("1", "Group", 1, None, 1),
        IRACNode("1A", "Class", 2, "1", 1),
        IRACNode("1A:item", "Ingredient", 3, "1A", 1),
    )


def _read_scalar_yaml(path: Path) -> dict[str, object]:
    values: dict[str, object] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line or line[0].isspace() or ":" not in line:
            continue
        key, value = line.split(":", 1)
        try:
            values[key] = json.loads(value.strip())
        except json.JSONDecodeError:
            values[key] = value.strip().strip('"')
    return values


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def test_valid_document_has_no_semantic_findings():
    assert validate_irac_document(_document(*_valid_nodes())) == []


def test_duplicate_node_identifier_is_reported():
    document = _document(*_valid_nodes(), IRACNode("1A", "Other class", 2, "1", 2))

    assert "node.identifier_duplicate" in {
        finding.rule_id for finding in validate_irac_document(document)
    }


def test_missing_parent_is_reported():
    document = _document(IRACNode("1A", "Class", 2, "missing", 1))

    findings = validate_irac_document(document)

    assert [
        (finding.rule_id, finding.node_identifier, finding.parent_identifier)
        for finding in findings
    ] == [("parent.not_found", "1A", "missing")]


def test_invalid_parent_level_is_reported():
    document = _document(
        IRACNode("1", "Group", 1, None, 1),
        IRACNode("1A:item", "Ingredient", 3, "1", 1),
    )

    assert [finding.rule_id for finding in validate_irac_document(document)] == [
        "parent.level_invalid"
    ]


def test_self_parent_and_cycle_are_reported():
    self_parent = _document(IRACNode("1A", "Class", 2, "1A", 1))
    cycle = _document(
        IRACNode("A", "Class A", 2, "B", 1),
        IRACNode("B", "Class B", 2, "A", 1),
    )

    assert "parent.self_reference" in {
        finding.rule_id for finding in validate_irac_document(self_parent)
    }
    assert "parent.cycle" in {
        finding.rule_id for finding in validate_irac_document(cycle)
    }


def test_duplicate_semantic_record_is_scoped_to_parent():
    document = _document(
        IRACNode("1", "Group 1", 1, None, 1),
        IRACNode("2", "Group 2", 1, None, 1),
        IRACNode("1A", "Same class", 2, "1", 1),
        IRACNode("1B", "Same class", 2, "1", 1),
        IRACNode("2A", "Same class", 2, "2", 1),
    )

    semantic = [
        finding
        for finding in validate_irac_document(document)
        if finding.rule_id.startswith("semantic.")
    ]

    assert [(finding.rule_id, finding.parent_identifier) for finding in semantic] == [
        ("semantic.class_duplicate", "1")
    ]


def test_finding_order_is_deterministic():
    document = _document(
        IRACNode("B", "", 2, "missing", 1),
        IRACNode("A", "", 2, "missing", 1),
        IRACNode("A", "Duplicate", 2, "missing", 1),
    )

    first = validate_irac_document(document)

    assert first == validate_irac_document(document)
    assert first == sorted(
        first,
        key=lambda finding: (
            finding.rule_id,
            finding.node_identifier or "",
            finding.parent_identifier or "",
            finding.severity,
            finding.message,
        ),
    )


def test_registered_irac_v11_5_source_passes_semantic_and_count_validation():
    manifest = _read_scalar_yaml(MANIFEST)
    identity = _read_scalar_yaml(GOLDEN_DIR / "source_identity.yaml")
    expected_counts = _read_scalar_yaml(GOLDEN_DIR / "expected_counts.yaml")
    source = ROOT / identity["source_path"]

    if not source.is_file():
        pytest.skip(
            "official publication is not distributed; follow references/IRAC/retrieval.md"
        )

    assert identity["source_path"] == manifest["source_path"]
    assert identity["sha256"] == manifest["sha256"] == _sha256(source)
    assert (
        identity["file_size_bytes"]
        == manifest["file_size_bytes"]
        == source.stat().st_size
    )

    document = parse_irac_pdf(source)
    assert (
        identity["classification_version"]
        == manifest["classification_version"]
        == document.version
    )
    actual_counts = {
        "total_nodes": len(document.nodes),
        "moa_groups": sum(node.level == 1 for node in document.nodes),
        "chemical_classes": sum(node.level == 2 for node in document.nodes),
        "active_ingredients": sum(node.level == 3 for node in document.nodes),
    }

    assert actual_counts == expected_counts
    assert validate_irac_v11_5(document) == []

"""Read-only regression checks for the registered IRAC v11.5 source."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import pytest

from cpmoakb.parsers.irac_parser import parse_irac_pdf

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "data" / "official" / "IRAC" / "source_manifest.yaml"
GOLDEN_DIR = ROOT / "tests" / "golden" / "irac_v11_5"


def _read_scalar_yaml(path: Path) -> dict[str, object]:
    values: dict[str, object] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line or line[0].isspace() or ":" not in line:
            continue
        key, value = line.split(":", 1)
        value = value.strip()
        try:
            values[key] = json.loads(value)
        except json.JSONDecodeError:
            values[key] = value.strip('"')
    return values


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _registered_source(identity: dict[str, object]) -> Path:
    source = ROOT / str(identity["source_path"])
    if not source.is_file():
        pytest.skip(
            "official publication is not distributed; follow references/IRAC/retrieval.md"
        )
    return source


def _node_records(document) -> list[dict[str, object]]:
    return sorted(
        (
            {
                "code": node.code,
                "name": node.name,
                "level": node.level,
                "parent_code": node.parent_code,
                "page": node.page,
            }
            for node in document.nodes
        ),
        key=lambda node: (
            node["level"],
            node["code"],
            node["name"],
            node["parent_code"] or "",
            node["page"],
        ),
    )


def test_registered_source_matches_golden_identity():
    manifest = _read_scalar_yaml(MANIFEST)
    identity = _read_scalar_yaml(GOLDEN_DIR / "source_identity.yaml")
    source = _registered_source(identity)

    assert source.is_file(), f"Registered canonical source is missing: {source}"
    assert identity["classification_version"] == manifest["classification_version"]
    assert identity["source_path"] == manifest["source_path"]
    assert identity["sha256"] == manifest["sha256"]
    assert identity["file_size_bytes"] == manifest["file_size_bytes"]
    assert (
        _sha256(source) == identity["sha256"]
    ), "Canonical IRAC PDF SHA-256 differs from the golden identity."
    assert (
        source.stat().st_size == identity["file_size_bytes"]
    ), "Canonical IRAC PDF size differs from the golden identity."


def test_registered_source_parser_counts_match_golden_baseline():
    identity = _read_scalar_yaml(GOLDEN_DIR / "source_identity.yaml")
    expected = _read_scalar_yaml(GOLDEN_DIR / "expected_counts.yaml")
    document = parse_irac_pdf(_registered_source(identity))
    actual = {
        "total_nodes": len(document.nodes),
        "moa_groups": sum(node.level == 1 for node in document.nodes),
        "chemical_classes": sum(node.level == 2 for node in document.nodes),
        "active_ingredients": sum(node.level == 3 for node in document.nodes),
    }

    assert (
        document.version == identity["classification_version"]
    ), "Parsed IRAC version differs from the golden identity."
    assert (
        actual == expected
    ), "Parsed IRAC node counts differ from the golden baseline."


def test_registered_source_parser_hierarchy_matches_golden_baseline():
    identity = _read_scalar_yaml(GOLDEN_DIR / "source_identity.yaml")
    expected = json.loads(
        (GOLDEN_DIR / "expected_hierarchy.json").read_text(encoding="utf-8")
    )
    document = parse_irac_pdf(_registered_source(identity))

    assert (
        document.version == expected["classification_version"]
    ), "Parsed IRAC version differs from the golden hierarchy."
    assert (
        _node_records(document) == expected["nodes"]
    ), "Parsed IRAC hierarchy differs from the golden baseline."

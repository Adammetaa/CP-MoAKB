"""Explicitly generate the IRAC v11.5 parser golden baseline files."""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from cpmoakb.parsers.irac_parser import parse_irac_pdf


MANIFEST = ROOT / "data" / "official" / "IRAC" / "source_manifest.yaml"
GOLDEN_DIR = ROOT / "tests" / "golden" / "irac_v11_5"
GOLDEN_FILES = (
    GOLDEN_DIR / "source_identity.yaml",
    GOLDEN_DIR / "expected_counts.yaml",
    GOLDEN_DIR / "expected_hierarchy.json",
)


def _read_manifest_values(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line or line[0].isspace() or ":" not in line:
            continue
        key, value = line.split(":", 1)
        values[key] = value.strip().strip('"')
    return values


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


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


def _write_yaml(path: Path, values: dict[str, object]) -> None:
    path.write_text(
        "".join(f'{key}: {json.dumps(value)}\n' for key, value in values.items()),
        encoding="utf-8",
    )


def generate(*, overwrite: bool = False) -> None:
    if any(path.exists() for path in GOLDEN_FILES) and not overwrite:
        raise FileExistsError("Golden baseline files already exist; rerun with --overwrite to replace them.")

    manifest = _read_manifest_values(MANIFEST)
    source_path = ROOT / manifest["source_path"]
    document = parse_irac_pdf(source_path)
    records = _node_records(document)
    counts = {
        "total_nodes": len(records),
        "moa_groups": sum(node["level"] == 1 for node in records),
        "chemical_classes": sum(node["level"] == 2 for node in records),
        "active_ingredients": sum(node["level"] == 3 for node in records),
    }
    identity = {
        "classification_version": document.version,
        "source_path": manifest["source_path"],
        "sha256": _sha256(source_path),
        "file_size_bytes": source_path.stat().st_size,
    }

    GOLDEN_DIR.mkdir(parents=True, exist_ok=True)
    _write_yaml(GOLDEN_FILES[0], identity)
    _write_yaml(GOLDEN_FILES[1], counts)
    GOLDEN_FILES[2].write_text(
        json.dumps({"classification_version": document.version, "nodes": records}, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--overwrite", action="store_true", help="replace existing golden baseline files")
    arguments = parser.parse_args()
    generate(overwrite=arguments.overwrite)

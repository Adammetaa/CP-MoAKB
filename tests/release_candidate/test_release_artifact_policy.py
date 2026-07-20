from __future__ import annotations

from pathlib import Path

from scripts.verify_distribution import FORBIDDEN_PARTS, FORBIDDEN_SUFFIXES

ROOT = Path(__file__).parents[2]


def test_release_artifact_policy_excludes_references_and_publications() -> None:
    manifest = (ROOT / "MANIFEST.in").read_text(encoding="utf-8")

    assert "references" in FORBIDDEN_PARTS
    assert ".pdf" in FORBIDDEN_SUFFIXES
    assert "prune references" in manifest
    assert "global-exclude *.csv *.db *.pdf" in manifest

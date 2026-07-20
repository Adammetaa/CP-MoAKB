from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]


def test_changelog_distinguishes_preparation_from_publication() -> None:
    text = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")

    assert "## Unreleased" in text
    assert "## 0.1.0 — Prepared, not published" in text
    assert "separately approved" in text
    assert "## [0.1.0] -" not in text

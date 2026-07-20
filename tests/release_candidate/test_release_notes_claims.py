from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]


def test_release_notes_preserve_capability_and_publication_boundaries() -> None:
    text = (ROOT / "docs/release/release-notes-0.1.0.md").read_text(encoding="utf-8")
    lowered = text.casefold()

    assert "prepared, not published" in lowered
    assert "not a production server" in lowered
    assert "not a diagnosis" in lowered
    assert "not a recommendation" in lowered
    assert "no usable agricultural corpus" in lowered
    assert "published on pypi" not in lowered
    assert "production-ready" not in lowered

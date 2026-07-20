from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]


def test_license_audit_is_bounded_and_reference_publications_are_absent() -> None:
    text = (ROOT / "docs/release/license-and-attribution-audit.md").read_text(
        encoding="utf-8"
    )
    normalized = " ".join(text.split())

    assert "Apache-2.0" in text
    assert "not legal advice" in text
    assert "not tracked, bundled, mirrored, uploaded" in normalized
    assert not tuple(ROOT.glob("docs/*.pdf"))

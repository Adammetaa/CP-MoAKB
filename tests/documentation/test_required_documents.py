from __future__ import annotations

from scripts.verify_documentation import REQUIRED_DOCUMENTS, ROOT


def test_all_required_documents_are_present_and_substantive() -> None:
    assert len(REQUIRED_DOCUMENTS) >= 75
    for relative in REQUIRED_DOCUMENTS:
        text = (ROOT / relative).read_text(encoding="utf-8")
        assert len(text.strip()) >= 120, relative


def test_audience_navigation_entry_points_are_present() -> None:
    for relative in (
        "README.md",
        "docs/README.md",
        "examples/README.md",
        "docs/api/README.md",
        "docs/architecture/README.md",
        "docs/contributing/README.md",
        "docs/maintainers/README.md",
        "docs/release/README.md",
        "docs/security/README.md",
    ):
        assert (ROOT / relative).is_file()

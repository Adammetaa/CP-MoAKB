from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]


def test_workflow_has_no_publication_or_credentials() -> None:
    workflow = (
        (ROOT / ".github/workflows/ci.yml").read_text(encoding="utf-8").casefold()
    )

    assert "contents: read" in workflow
    for prohibited in (
        "id-token: write",
        "contents: write",
        "packages: write",
        "secrets.",
        "twine",
        "gh release",
        "git tag",
        "pypi",
    ):
        assert prohibited not in workflow

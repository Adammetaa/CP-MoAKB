from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]


def test_publication_approvals_remain_explicit_and_unchecked() -> None:
    checklist = (ROOT / "docs/release/release-candidate-checklist.md").read_text(
        encoding="utf-8"
    )
    runbook = (ROOT / "docs/release/publication-runbook.md").read_text(encoding="utf-8")

    for action in (
        "release-candidate acceptance",
        "final version terminology and tag name",
        "Git tag creation",
        "GitHub Release creation",
        "artifact upload",
        "package-index publication",
    ):
        assert "- [ ] Owner" in checklist and action in checklist
    for gate in range(1, 7):
        assert f"Gate {gate}" in runbook

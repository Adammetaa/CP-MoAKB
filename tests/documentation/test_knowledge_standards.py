from __future__ import annotations

from scripts.verify_documentation import GROUPS, ROOT

REQUIRED_SECTIONS = (
    "## Purpose",
    "## Scope",
    "## Out of Scope",
    "## Normative Language",
    "## Definitions",
    "## Governance Rules",
    "## Examples",
    "## Non-examples",
    "## Reviewer Notes",
    "## Future Considerations",
)


def test_knowledge_authoring_standard_family_is_complete() -> None:
    names = GROUPS["knowledge"]

    assert names == (
        "README.md",
        "KAS-001-knowledge-authoring-principles.md",
        "KAS-002-knowledge-record-standard.md",
        "KAS-003-evidence-standard.md",
        "KAS-004-citation-standard.md",
        "KAS-005-terminology-standard.md",
        "KAS-006-relationship-standard.md",
        "KAS-007-knowledge-lifecycle.md",
    )
    for name in names[1:]:
        text = (ROOT / "docs" / "knowledge" / name).read_text(encoding="utf-8")
        assert "Status: Active" in text
        assert "Version: 1.0" in text
        assert all(section in text for section in REQUIRED_SECTIONS)


def test_kas_family_is_knowledge_only_and_implementation_neutral() -> None:
    combined = " ".join(
        "\n".join(
            (ROOT / "docs" / "knowledge" / name).read_text(encoding="utf-8")
            for name in GROUPS["knowledge"]
        ).split()
    ).casefold()

    assert "does not create scientific content" in combined
    assert "does not create a vocabulary" in combined
    assert "does not create an ontology" in combined
    assert "does not implement a workflow" in combined
    assert "runtime architecture specifications" in combined
    assert "govern software engineering" in combined

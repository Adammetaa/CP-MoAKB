from __future__ import annotations

from scripts.verify_documentation import GROUPS, KNOWLEDGE_GOVERNANCE_DOCUMENTS, ROOT

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


def test_knowledge_constitution_is_distinct_and_authoritative() -> None:
    constitution = (
        ROOT / "docs/knowledge/constitution/knowledge-constitution.md"
    ).read_text(encoding="utf-8")
    normalized_constitution = " ".join(constitution.split())
    kas_001 = (
        ROOT / "docs/knowledge/KAS-001-knowledge-authoring-principles.md"
    ).read_text(encoding="utf-8")

    assert "highest normative authority within CP-MoAKB knowledge governance" in (
        normalized_constitution
    )
    assert "KAS-001 MUST conform to this Constitution" in normalized_constitution
    assert "Apply the [Knowledge Constitution]" in kas_001
    assert "A KAS amendment MUST NOT amend or supersede" in kas_001


def test_knowledge_authorities_are_explicit_without_supersession() -> None:
    constitution = (
        ROOT / "docs/knowledge/constitution/knowledge-constitution.md"
    ).read_text(encoding="utf-8")
    normalized_constitution = " ".join(constitution.split())

    for authority in (
        "ADR-005",
        "ADR-006",
        "ADR-007",
        "ADR-008",
        "ADR-009",
        "RAS-001 through RAS-015",
        "Design Freeze",
        "Source Policy",
        "Publication Boundary",
    ):
        assert authority in normalized_constitution
    assert (
        "MUST NOT duplicate, silently supersede, or broaden" in normalized_constitution
    )
    assert "source authority and truth" in normalized_constitution
    assert "candidate-record format of the Rice pilot" in normalized_constitution


def test_knowledge_roadmap_is_complete_and_planning_only() -> None:
    roadmap = (
        ROOT / "docs/knowledge/roadmap/knowledge-engineering-roadmap.md"
    ).read_text(encoding="utf-8")

    assert KNOWLEDGE_GOVERNANCE_DOCUMENTS == (
        "docs/knowledge/constitution/README.md",
        "docs/knowledge/constitution/knowledge-constitution.md",
        "docs/knowledge/roadmap/knowledge-engineering-roadmap.md",
    )
    for number in range(32, 40):
        assert f"Sprint-{number:03d}K" in roadmap
    for phase in (
        "Governance work",
        "Authoring preparation",
        "Pilot knowledge authoring",
        "Domain population",
        "Future implementation mapping",
    ):
        assert phase in roadmap
    assert "Status: Planning only" in roadmap
    assert "MUST NOT create data, schema, Runtime behavior" in roadmap

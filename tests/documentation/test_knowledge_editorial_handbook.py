from __future__ import annotations

from scripts.verify_documentation import KNOWLEDGE_EDITORIAL_DOCUMENTS, ROOT

REQUIRED_SECTIONS = (
    "## Purpose",
    "## Scope",
    "## Out of Scope",
    "## Authority",
    "## Definitions",
    "## Responsibilities",
    "## Procedure",
    "## Required Inputs",
    "## Required Outputs",
    "## Review Points",
    "## Failure Modes",
    "## Examples",
    "## Non-examples",
    "## Escalation",
    "## Audit Requirements",
    "## Change Control",
    "## Future Considerations",
)


def _text(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def test_editorial_family_is_complete_and_normative() -> None:
    assert len(KNOWLEDGE_EDITORIAL_DOCUMENTS) == 26
    for relative in KNOWLEDGE_EDITORIAL_DOCUMENTS:
        assert (ROOT / relative).is_file()
    for relative in KNOWLEDGE_EDITORIAL_DOCUMENTS[1:23]:
        text = _text(relative)
        assert "Status: Active" in text
        assert "Version: 1.0" in text
        assert all(section in text for section in REQUIRED_SECTIONS)


def test_handbook_preserves_authority_and_separation() -> None:
    handbook = _text(KNOWLEDGE_EDITORIAL_DOCUMENTS[1])
    for authority in (
        "Knowledge Constitution",
        "KAS-001 through KAS-007",
        "KGS-001 through KGS-006",
        "ADR-005 through ADR-009",
        "RAS-001 through RAS-015",
        "Design Freeze",
        "Publication Boundary",
    ):
        assert authority in handbook
    for boundary in (
        "UI translation MUST NOT create accepted terminology",
        "Field observation MUST remain an evidence candidate",
        "Evidence attachment MUST NOT become diagnosis",
        "Accepted knowledge MUST NOT become advice",
    ):
        assert boundary in handbook


def test_workflows_cover_required_operational_controls() -> None:
    source = _text(KNOWLEDGE_EDITORIAL_DOCUMENTS[2])
    evidence = _text(KNOWLEDGE_EDITORIAL_DOCUMENTS[3])
    candidate = _text(KNOWLEDGE_EDITORIAL_DOCUMENTS[4])
    terminology = _text(KNOWLEDGE_EDITORIAL_DOCUMENTS[5])
    relationship = _text(KNOWLEDGE_EDITORIAL_DOCUMENTS[6])
    review = _text(KNOWLEDGE_EDITORIAL_DOCUMENTS[7])
    publication = _text(KNOWLEDGE_EDITORIAL_DOCUMENTS[8])

    assert "unknown redistribution" in source.casefold()
    assert "source to evidence" in evidence.replace("-", " ").casefold()
    assert (
        "concept candidate" in candidate and "ADR-009 governs format only" in candidate
    )
    assert "UI localization does not create accepted terminology" in terminology
    for predicate in ("causes", "prevents", "controls", "safe_for", "permitted_in"):
        assert predicate in relationship
    for decision in (
        "approve",
        "return for revision",
        "reject",
        "defer",
        "escalate",
        "recuse",
    ):
        assert decision in review
    for event in (
        "Git tag",
        "GitHub Release",
        "package publication",
        "knowledge release",
    ):
        assert event in publication


def test_checklists_are_human_review_instruments() -> None:
    for relative in KNOWLEDGE_EDITORIAL_DOCUMENTS[16:23]:
        text = _text(relative)
        for column in ("Pass", "Fail", "N/A", "RR", "Reviewer notes"):
            assert column in text
        assert "software form" in text.casefold() or "software gate" in text.casefold()


def test_examples_are_fictional_and_not_candidate_data() -> None:
    examples = "\n".join(_text(path) for path in KNOWLEDGE_EDITORIAL_DOCUMENTS[23:])
    assert "entirely fictional" in examples.casefold()
    assert "no real crop" in examples.casefold()
    assert "MUST NOT become candidate data" in examples
    assert "unsupported certainty" in examples

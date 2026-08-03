from __future__ import annotations

from scripts.verify_documentation import KNOWLEDGE_REVIEW_DOCUMENTS, ROOT

REQUIRED_SECTIONS = (
    "## Purpose",
    "## Scope",
    "## Out of Scope",
    "## Authority",
    "## Definitions",
    "## Required Inputs",
    "## Procedure",
    "## Decision Rules",
    "## Responsibilities",
    "## Failure Modes",
    "## Escalation",
    "## Audit Requirements",
    "## Examples",
    "## Non-examples",
    "## Change Control",
    "## Future Considerations",
)


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def test_review_document_family_is_complete() -> None:
    assert len(KNOWLEDGE_REVIEW_DOCUMENTS) == 25
    for relative in KNOWLEDGE_REVIEW_DOCUMENTS:
        text = _read(relative)
        assert "Status:" in text
        assert "Version: 1.0" in text
        assert all(section in text for section in REQUIRED_SECTIONS)


def test_framework_preserves_human_authority_and_blockers() -> None:
    framework = _read(KNOWLEDGE_REVIEW_DOCUMENTS[1])
    for authority in (
        "Knowledge Constitution",
        "KAS-001 through KAS-007",
        "KGS-001 through KGS-006",
        "Editorial Handbook",
        "ADR-005 through ADR-009",
        "RAS-001 through RAS-015",
        "Design Freeze",
        "Publication Boundary",
    ):
        assert authority in framework
    assert "No majority vote may override" in framework
    assert "No review automatically creates truth" in framework
    assert "numeric aggregation" in framework


def test_all_required_review_types_define_competence_and_blockers() -> None:
    for relative in KNOWLEDGE_REVIEW_DOCUMENTS[2:9]:
        text = _read(relative).casefold()
        assert "competence" in text
        assert "blocking" in text or "blocks" in text
        assert "recuse" in text
        assert "audit requirements" in text
        for section in (
            "## Review Questions",
            "## Mandatory Evidence",
            "## Required Outputs",
            "## Recusal Conditions",
        ):
            assert section.casefold() in text


def test_finding_classes_and_acceptance_gates_are_complete() -> None:
    findings = _read(KNOWLEDGE_REVIEW_DOCUMENTS[9])
    for finding_class in (
        "Blocking",
        "Major",
        "Minor",
        "Editorial",
        "Clarification Required",
        "Evidence Gap",
        "Conflict",
        "Out of Scope",
        "Rights Blocker",
        "Governance Blocker",
    ):
        assert f"| {finding_class} |" in findings
    assert "MUST NOT be summed, averaged, ranked, weighted" in findings

    acceptance = _read(KNOWLEDGE_REVIEW_DOCUMENTS[10])
    for gate in (
        "Source candidate",
        "Evidence candidate",
        "Terminology candidate",
        "Relationship candidate",
        "Concept candidate",
        "Accepted knowledge version",
        "Publication-ready knowledge version",
    ):
        assert gate in acceptance
    assert "Accepted, not published" in acceptance


def test_competence_conflicts_matrix_and_final_gate_are_human_governed() -> None:
    competence = _read(KNOWLEDGE_REVIEW_DOCUMENTS[14])
    for lifecycle in ("Nominate", "Approve", "renew", "suspend", "revoke"):
        assert lifecycle.casefold() in competence.casefold()

    conflicts = _read(KNOWLEDGE_REVIEW_DOCUMENTS[16])
    for category in (
        "Financial",
        "organizational",
        "authorship",
        "supervisory",
        "competitive",
        "personal",
        "regulatory",
        "publication",
    ):
        assert category.casefold() in conflicts.casefold()

    matrix = _read(KNOWLEDGE_REVIEW_DOCUMENTS[17])
    for candidate in (
        "Source Candidate",
        "Evidence Candidate",
        "Concept Candidate",
        "Terminology Candidate",
        "Relationship Candidate",
        "Revision Candidate",
        "Deprecation Candidate",
        "Supersession Candidate",
        "Publication Candidate",
    ):
        assert candidate in matrix

    final_gate = _read(KNOWLEDGE_REVIEW_DOCUMENTS[21])
    assert "All blockers are independently closed" in final_gate
    assert "Publication remains separately authorized" in final_gate


def test_fictional_examples_contain_no_real_domain_content() -> None:
    examples = "\n".join(_read(path) for path in KNOWLEDGE_REVIEW_DOCUMENTS[22:])
    assert "every entity, source, authority, and assertion is invented" in examples
    assert "Evidence Gap" in examples
    assert "Rights Blocker" in examples
    assert "unsupported causal relationship" in examples
    assert "conflict of interest" in examples
    assert "MUST NOT become candidate data" in examples

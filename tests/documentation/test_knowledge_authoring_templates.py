from __future__ import annotations

from scripts.verify_documentation import KNOWLEDGE_TEMPLATE_DOCUMENTS, ROOT

REQUIRED_SECTIONS = (
    "## Purpose",
    "## Scope",
    "## Out of Scope",
    "## Authority",
    "## When to Use",
    "## Who Completes It",
    "## Required Inputs",
    "## Template Fields",
    "## Completion Rules",
    "## Prohibited Content",
    "## Review Requirements",
    "## Failure Modes",
    "## Example",
    "## Non-example",
    "## Audit and Retention",
    "## Change Control",
)


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def test_template_family_is_complete_and_human_governed() -> None:
    assert len(KNOWLEDGE_TEMPLATE_DOCUMENTS) == 25
    for relative in KNOWLEDGE_TEMPLATE_DOCUMENTS:
        text = _read(relative)
        assert "Status:" in text
        assert "Version: 1.0" in text
        assert all(section in text for section in REQUIRED_SECTIONS)
    for relative in KNOWLEDGE_TEMPLATE_DOCUMENTS[2:22]:
        text = _read(relative)
        for heading in (
            "| Field | Purpose | Status | Permitted content | Prohibited content |",
            "Completion guidance | Reviewer | Example | Non-example |",
        ):
            assert heading in text


def test_template_governance_preserves_authority_and_schema_boundary() -> None:
    governance = _read(KNOWLEDGE_TEMPLATE_DOCUMENTS[1])
    for authority in (
        "Knowledge Constitution",
        "KAS",
        "KGS",
        "Editorial Handbook",
        "Review Framework",
        "ADR-009 remains authoritative only",
        "RAS-001 through RAS-015",
        "Design Freeze",
        "Publication Boundary",
    ):
        assert authority in governance
    for boundary in (
        "A template is not a schema",
        "not automatically accepted knowledge",
        "does not imply scientific validity",
        "does not authorize publication",
        "separate ADR/RAS approval",
    ):
        assert boundary in governance
    for state in ("Unknown", "Unavailable", "Not applicable"):
        assert state in governance


def test_authoring_templates_cover_required_fields_and_prohibitions() -> None:
    source = _read(KNOWLEDGE_TEMPLATE_DOCUMENTS[2])
    evidence = _read(KNOWLEDGE_TEMPLATE_DOCUMENTS[3])
    concept = _read(KNOWLEDGE_TEMPLATE_DOCUMENTS[4])
    terminology = _read(KNOWLEDGE_TEMPLATE_DOCUMENTS[5])
    relationship = _read(KNOWLEDGE_TEMPLATE_DOCUMENTS[6])
    issue = _read(KNOWLEDGE_TEMPLATE_DOCUMENTS[7])

    for field in (
        "Nomination identity",
        "Institutional author",
        "Redistribution status",
        "Retraction status",
        "Intended claim scope",
    ):
        assert f"| {field} |" in source
    for field in (
        "Exact source location",
        "Claim contradicted",
        "Figure/table rights status",
        "Withdrawal status",
    ):
        assert f"| {field} |" in evidence
    for field in (
        "Governed candidate identity",
        "Ontology placement proposal",
        "Review requirements",
        "Change history",
    ):
        assert f"| {field} |" in concept
    assert "UI translation authority" in terminology
    for predicate in (
        "causes",
        "prevents",
        "controls",
        "effective_against",
        "managed_by",
        "safe_for",
        "permitted_in",
        "prohibited_in",
    ):
        assert predicate in relationship
    assert "no inference is permitted" in relationship.casefold()
    assert "Closure evidence" in issue and "Audit history" in issue


def test_review_lifecycle_and_package_templates_cover_governed_gates() -> None:
    finding = _read(KNOWLEDGE_TEMPLATE_DOCUMENTS[8])
    decision = _read(KNOWLEDGE_TEMPLATE_DOCUMENTS[9])
    assert "Finding class" in finding and "Closure authority" in finding
    assert "Reviewer competence" in decision and "Conflict declaration" in decision

    for relative in KNOWLEDGE_TEMPLATE_DOCUMENTS[13:19]:
        text = _read(relative)
        for field in (
            "Affected identity/version",
            "Triggering evidence",
            "Required reviews",
            "Affected relationships",
            "Affected terminology",
            "Rollback information",
            "Decision authority",
            "Audit trail",
        ):
            assert f"| {field} |" in text

    release = _read(KNOWLEDGE_TEMPLATE_DOCUMENTS[21])
    assert "MUST NOT authorize or perform publication" in release
    assert "not_published" in release


def test_examples_are_fictional_complete_and_blocked() -> None:
    examples = "\n".join(_read(path) for path in KNOWLEDGE_TEMPLATE_DOCUMENTS[22:])
    for prohibited_real_content in (
        "No real crop",
        "disease",
        "insect",
        "chemical",
        "authority",
        "source",
        "regulation",
        "diagnosis",
        "recommendation",
    ):
        assert prohibited_real_content.casefold() in examples.casefold()
    for blocked_item in (
        "Missing source identity",
        "Rights unknown",
        "Evidence Gap",
        "ambiguous preferred-term",
        "unsupported high-risk relationship",
        "Conflict of interest",
        "Open blockers",
    ):
        assert blocked_item.casefold() in examples.casefold()
    assert "not_published" in examples

from __future__ import annotations

from scripts.verify_documentation import KNOWLEDGE_GOVERNANCE_STANDARDS, ROOT

REQUIRED_SECTIONS = (
    "## Purpose",
    "## Scope",
    "## Out of Scope",
    "## Definitions",
    "## Normative Language",
    "## Governance Rules",
    "## Examples",
    "## Non-examples",
    "## Reviewer Notes",
    "## Future Work",
)


def _read(name: str) -> str:
    return (ROOT / "docs" / "knowledge" / "governance" / name).read_text(
        encoding="utf-8"
    )


def test_knowledge_governance_standard_family_is_complete() -> None:
    assert KNOWLEDGE_GOVERNANCE_STANDARDS == (
        "docs/knowledge/governance/README.md",
        "docs/knowledge/governance/KGS-001-knowledge-governance-model.md",
        "docs/knowledge/governance/KGS-002-roles-and-responsibilities.md",
        "docs/knowledge/governance/KGS-003-review-process.md",
        "docs/knowledge/governance/KGS-004-conflict-management.md",
        "docs/knowledge/governance/KGS-005-publication-governance.md",
        "docs/knowledge/governance/KGS-006-audit-and-transparency.md",
    )
    for relative in KNOWLEDGE_GOVERNANCE_STANDARDS[1:]:
        text = (ROOT / relative).read_text(encoding="utf-8")
        assert "Status: Active" in text
        assert "Version: 1.0" in text
        assert all(section in text for section in REQUIRED_SECTIONS)


def test_governance_model_defines_required_bodies_and_decisions() -> None:
    model = _read("KGS-001-knowledge-governance-model.md")

    for body in (
        "Knowledge Board",
        "Scientific Board",
        "Domain Board",
        "Editorial Board",
        "Review Board",
    ):
        assert body in model
    for control in (
        "Authority Hierarchy",
        "Decision Hierarchy",
        "Consensus and Voting",
        "Escalation",
        "Appeal",
        "Emergency Correction",
    ):
        assert control in model


def test_roles_cover_qualifications_authority_limits_and_conflicts() -> None:
    roles = _read("KGS-002-roles-and-responsibilities.md")

    for role in (
        "Knowledge Author",
        "Scientific Reviewer",
        "Terminology Reviewer",
        "Ontology Reviewer",
        "Evidence Reviewer",
        "Domain Editor",
        "Managing Editor",
        "Release Editor",
        "Governance Committee",
        "Project Owner",
    ):
        assert f"### {role}" in roles
    assert "Common Qualification and Conduct Rules" in roles
    assert "### Conflict of Interest" in roles


def test_review_conflict_publication_and_audit_controls_are_complete() -> None:
    review = _read("KGS-003-review-process.md")
    conflict = _read("KGS-004-conflict-management.md")
    publication = _read("KGS-005-publication-governance.md")
    audit = _read("KGS-006-audit-and-transparency.md")

    for stage in (
        "Submission",
        "Review",
        "Revision",
        "Acceptance",
        "Publication",
        "Correction",
        "Deprecation",
        "Retirement",
        "Rejection",
        "Appeal",
    ):
        assert f"### {stage}" in review
    for dispute in (
        "Scientific Disagreement",
        "Terminology Disagreement",
        "Evidence Disagreement",
        "Authority Disagreement",
        "Publication Disagreement",
    ):
        assert f"### {dispute}" in conflict
    for control in (
        "Who May Publish",
        "Approval Authority",
        "Version Approval",
        "Knowledge Release",
        "Knowledge Freeze",
        "Emergency Publication",
        "Retraction",
        "Withdrawal",
    ):
        assert f"### {control}" in publication
    for log in (
        "Review Log",
        "Decision Log",
        "Evidence Log",
        "Publication Log",
        "Revision History",
        "Audit Trail Integrity",
    ):
        assert f"### {log}" in audit


def test_kgs_is_people_governance_not_software_or_knowledge_content() -> None:
    combined = " ".join(
        "\n".join(
            (ROOT / relative).read_text(encoding="utf-8")
            for relative in KNOWLEDGE_GOVERNANCE_STANDARDS
        ).split()
    ).casefold()

    assert "kgs governs who may act and decide" in combined
    assert "must not modify runtime" in combined
    assert "does not create knowledge" in combined
    assert "must not publish" in combined
    assert "does not decide scientific truth by vote" in combined

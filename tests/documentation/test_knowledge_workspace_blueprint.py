from __future__ import annotations

from scripts.verify_documentation import KNOWLEDGE_WORKSPACE_DOCUMENTS, ROOT, verify
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _family_text() -> str:
    return "\n".join(_read(relative) for relative in KNOWLEDGE_WORKSPACE_DOCUMENTS)


def test_workspace_document_family_is_complete() -> None:
    assert len(KNOWLEDGE_WORKSPACE_DOCUMENTS) == 33
    for relative in KNOWLEDGE_WORKSPACE_DOCUMENTS:
        text = _read(relative)
        assert "Status:" in text
        assert "Version:" in text
        assert len(text.strip()) >= 120


def test_explorer_and_lab_are_explicitly_separated() -> None:
    blueprint = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[1])
    boundary = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[3])
    assert "write/review side" in blueprint
    assert "Explorer" in blueprint and "Lab" in blueprint
    assert "read side" in boundary
    assert "write/review side" in boundary
    assert "Lab MUST NOT publish automatically" in boundary


def test_information_architecture_contains_every_required_area() -> None:
    site_map = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[5])
    for area in (
        "Dashboard",
        "My Tasks",
        "Inbox",
        "Sources",
        "Evidence",
        "Claims",
        "Concept Candidates",
        "Terminology Candidates",
        "Relationship Candidates",
        "Review Queue",
        "Findings",
        "Acceptance Gates",
        "Release Packages",
        "Corrections",
        "Deprecations",
        "Supersessions",
        "Archive",
        "Audit History",
        "Governance Reference",
        "Templates and Guidance",
    ):
        assert area in site_map


def test_queue_model_contains_every_required_queue() -> None:
    queues = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[6])
    for queue in (
        "Source Inbox",
        "Evidence Inbox",
        "Claim Inbox",
        "Candidate Inbox",
        "Review Queue",
        "Finding Resolution Queue",
        "Governance Escalation Queue",
        "Acceptance Queue",
        "Publication Readiness Queue",
        "Correction Queue",
        "Archive Queue",
    ):
        assert f"| {queue} |" in queues
    assert "no automated" in queues.casefold()


def test_role_model_contains_every_required_role() -> None:
    roles = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[8])
    for role in (
        "Knowledge Author",
        "Evidence Reviewer",
        "Scientific Reviewer",
        "Terminology Reviewer",
        "Ontology Reviewer",
        "Rights Reviewer",
        "Domain Editor",
        "Managing Editor",
        "Governance Reviewer",
        "Release Editor",
        "Knowledge Board",
        "Project Owner",
        "Read-only Observer",
    ):
        assert f"| {role} |" in roles
    assert "not a permission or authorization implementation" in roles


def test_screen_blueprints_cover_required_workspace_screens() -> None:
    screens = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[13])
    for screen in (
        "Workspace Dashboard",
        "My Tasks",
        "Inbox",
        "Source Candidate Detail",
        "Evidence Item Detail",
        "Claim Candidate Detail",
        "Concept Candidate Detail",
        "Terminology Candidate Detail",
        "Relationship Candidate Detail",
        "Review Queue",
        "Review Detail",
        "Finding Resolution",
        "Acceptance Gate",
        "Release Package",
        "Audit History",
        "Governance Reference",
        "Archive",
    ):
        assert f"| {screen} |" in screens


def test_component_library_contains_every_required_component() -> None:
    components = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[14])
    for component in (
        "Task Card",
        "Source Card",
        "Evidence Card",
        "Claim Card",
        "Candidate Card",
        "Terminology Card",
        "Relationship Card",
        "Review Card",
        "Finding Card",
        "Decision Card",
        "Acceptance Gate Card",
        "Release Package Card",
        "Audit Event",
        "Handoff Panel",
        "Version Comparison Panel",
        "Traceability Chain",
        "Authority Panel",
        "Rights Panel",
        "Conflict Banner",
        "Empty State",
        "Boundary Notice",
    ):
        assert f"| {component} |" in components


def test_review_and_finding_model_aligns_with_governed_framework() -> None:
    review = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[16])
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
        assert finding_class in review
    assert "fixed candidate version" in review
    assert "competence" in review
    assert "COI" in review
    assert "non-numeric" in review


def test_template_and_traceability_authorities_are_preserved() -> None:
    family = _family_text()
    assert "Templates" in family
    assert "ADR-008" in family
    assert "ADR-009" in family
    assert "Candidate→Claim→Evidence→Source→Authority→Review→Decision" in family
    assert "defines no schema" in family.casefold()


def test_acceptance_and_publication_are_separate() -> None:
    publication = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[25])
    assert "Accepted knowledge candidate" in publication
    assert "still not published" in publication
    assert "Explorer presentation" in publication
    assert "The Lab must not publish directly" in publication


def test_blueprint_does_not_claim_implementation_or_runtime_change() -> None:
    family = _family_text().casefold()
    assert "no implementation is authorized" in family
    assert "defines no schema" in family
    assert "no frontend" in family
    assert "no backend" in family
    for excluded_capability in ("runtime", "database", "automation", "persistence"):
        assert excluded_capability in family
    assert "documentation-only" in family


def test_safety_boundary_forbids_inference_diagnosis_and_recommendation() -> None:
    safety = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[24]).casefold()
    for prohibited in (
        "inference",
        "scoring",
        "diagnosis",
        "recommendation",
        "scientific neutrality",
        "missing evidence",
    ):
        assert prohibited in safety


def test_thai_first_future_readiness_is_documented() -> None:
    principles = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[4])
    screens = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[13])
    assert "Thai-first" in principles
    assert "English scientific" in principles
    assert "Thai-first future copy" in screens
    assert "bilingual precision" in screens


def test_wireframes_cover_all_required_devices_and_views() -> None:
    for relative in KNOWLEDGE_WORKSPACE_DOCUMENTS[27:30]:
        wireframe = _read(relative)
        for view in (
            "Dashboard",
            "Source Candidate",
            "Evidence Item",
            "Concept Candidate",
            "Review Detail",
            "Finding Resolution",
            "Acceptance Gate",
        ):
            assert view in wireframe
        assert "publication" in wireframe.casefold()


def test_fictional_journeys_cover_author_and_reviewer_handoffs() -> None:
    author = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[31])
    reviewer = _read(KNOWLEDGE_WORKSPACE_DOCUMENTS[32])
    for stage in (
        "Source nomination",
        "Evidence extraction",
        "Claim scoping",
        "Candidate submission",
        "Revision",
        "Resubmission",
    ):
        assert stage in author
    for stage in (
        "Competence check",
        "Conflict-of-interest check",
        "Evidence review",
        "Finding",
        "Revision verification",
        "Review decision",
        "Acceptance handoff",
    ):
        assert stage in reviewer
    assert "FICTION" in author and "FICTION" in reviewer
    assert "All objects and content are invented" in reviewer


def test_examples_are_domain_neutral_and_non_operational() -> None:
    examples = "\n".join(_read(path) for path in KNOWLEDGE_WORKSPACE_DOCUMENTS[30:])
    lowered = examples.casefold()
    for real_domain_marker in ("oryza", "zea mays", "irri", "pesticide", "fungicide"):
        assert real_domain_marker not in lowered
    assert "no agricultural master data" in lowered
    assert "no identity, persistence, permissions, automation" in lowered


def test_workspace_links_and_document_count_are_governed() -> None:
    assert len(verify()) == 618


def test_public_api_manifest_remains_unchanged() -> None:
    assert sum(len(exports) for exports in PUBLIC_API_EXPORTS.values()) == 165

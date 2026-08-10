from __future__ import annotations

import re

from scripts.verify_documentation import KNOWLEDGE_OBJECT_MODEL_DOCUMENTS, ROOT, verify
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS

OBJECT_CLASSES = (
    "source",
    "evidence",
    "claim",
    "concept",
    "terminology",
    "relationship",
    "authority",
    "review",
    "finding",
    "decision",
    "unresolved-issue",
    "lifecycle-event",
    "publication-record",
    "representation",
    "package-membership",
)
REQUIRED_CLASS_HEADINGS = (
    "Status:",
    "## Purpose",
    "## Scope",
    "## Out of Scope",
    "## Authority",
    "## Definition",
    "## Canonical Responsibility",
    "## Identity Responsibility",
    "## Version Responsibility",
    "## Lifecycle Responsibility",
    "## Required Meaning",
    "## Permitted References",
    "## Prohibited Content",
    "## Ownership",
    "## Review Requirements",
    "## Relationship to Knowledge Asset",
    "## Relationship to Knowledge Package",
    "## Explorer Presentation",
    "## Knowledge Lab Presentation",
    "## Audit Requirements",
    "## Example",
    "## Non-example",
    "## Failure Modes",
    "## Future Implementation Considerations",
    "## Change Control",
)


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _class(name: str) -> str:
    return _read(f"docs/knowledge/object-model/object-classes/{name}-object.md")


def _all() -> str:
    return "\n".join(_read(path) for path in KNOWLEDGE_OBJECT_MODEL_DOCUMENTS)


def _normalized(text: str) -> str:
    return " ".join(text.split())


def _section(text: str, heading: str) -> str:
    match = re.search(
        rf"^{re.escape(heading)}\n\n(?P<body>.*?)(?=\n## |\Z)",
        text,
        re.MULTILINE | re.DOTALL,
    )
    assert match is not None, heading
    return " ".join(match.group("body").split())


def test_full_document_family_and_every_required_object_class_exist() -> None:
    assert len(KNOWLEDGE_OBJECT_MODEL_DOCUMENTS) == 29
    assert len(OBJECT_CLASSES) == 15
    for relative in KNOWLEDGE_OBJECT_MODEL_DOCUMENTS:
        assert (ROOT / relative).is_file(), relative
    for name in OBJECT_CLASSES:
        assert (
            ROOT / f"docs/knowledge/object-model/object-classes/{name}-object.md"
        ).is_file()


def test_every_object_class_has_complete_governed_quality_structure() -> None:
    for name in OBJECT_CLASSES:
        text = _class(name)
        for heading in REQUIRED_CLASS_HEADINGS:
            assert heading in text, (name, heading)
        for normative in ("MUST", "MUST NOT", "MAY"):
            assert normative in text, (name, normative)


def test_every_object_has_a_distinct_canonical_responsibility() -> None:
    responsibilities = {
        name: _section(_class(name), "## Canonical Responsibility")
        for name in OBJECT_CLASSES
    }
    assert len(set(responsibilities.values())) == len(OBJECT_CLASSES)
    assert all(len(value) > 80 for value in responsibilities.values())


def test_claim_evidence_concept_and_relationship_remain_separate() -> None:
    claim = _class("claim")
    evidence = _class("evidence")
    concept = _class("concept")
    relationship = _class("relationship")
    assert "Claim identity MUST remain independent from Concept, Evidence" in claim
    assert "It MUST NOT become universal truth" in evidence
    assert "Concept identity MUST be stable, label-independent" in concept
    assert "every asserted semantic relationship as an explicit" in relationship
    assert "MUST NOT exist only because of UI navigation" in relationship


def test_source_and_evidence_models_preserve_traceability_and_states() -> None:
    source = _class("source")
    evidence = _class("evidence")
    for requirement in (
        "correction",
        "retraction",
        "replacement",
        "access",
        "redistribution status",
        "provenance",
        "citation",
    ):
        assert requirement.casefold() in source.casefold()
    for state in (
        "supported",
        "contradicted",
        "withdrawn",
        "superseded",
        "rights-constrained",
        "incomplete",
        "unavailable",
    ):
        assert state in evidence
    assert "exact Source version and locator" in evidence


def test_terminology_and_authority_scopes_are_explicit() -> None:
    terminology = _class("terminology")
    authority = _class("authority")
    for term_type in (
        "preferred",
        "alternative",
        "scientific",
        "common",
        "local",
        "transliterated",
        "abbreviated",
        "historical",
        "deprecated",
        "ambiguous",
    ):
        assert term_type in terminology
    assert "UI localization" in terminology
    for scope in (
        "source",
        "nomenclatural",
        "regulatory",
        "terminology",
        "review",
        "publication",
    ):
        assert scope in authority
    assert "Institution name alone MUST NOT imply universal authority" in authority


def test_review_finding_and_decision_are_independent() -> None:
    review = _class("review")
    finding = _class("finding")
    decision = _class("decision")
    assert "Review MUST NOT edit scientific content, become a Decision" in review
    assert "Finding closure MUST NOT become Knowledge acceptance" in finding
    assert "Review MUST NOT equal Decision" in decision
    assert "Decision MUST NOT equal Publication" in decision
    for requirement in (
        "competence",
        "conflicts",
        "fixed inputs",
        "Findings",
        "responses",
        "dissent",
    ):
        assert requirement in review + finding + decision


def test_unresolved_issues_never_disappear_or_use_numeric_scoring() -> None:
    issue = _class("unresolved-issue")
    for state in (
        "unknown",
        "unavailable",
        "conflicting",
        "insufficiently evidenced",
        "pending review",
        "out of scope",
        "rights blocked",
        "governance blocked",
    ):
        assert state in issue
    assert "blocking, non-blocking" in issue
    assert "without numeric scoring" in issue
    assert "MUST NOT disappear through editing" in issue


def test_lifecycle_and_publication_records_preserve_distinct_meaning() -> None:
    lifecycle = _class("lifecycle-event")
    publication = _class("publication-record")
    for event in (
        "nomination",
        "draft creation",
        "review submission",
        "revision",
        "acceptance",
        "publication readiness",
        "publication",
        "correction",
        "deprecation",
        "supersession",
        "retirement",
        "archive",
        "rejection",
    ):
        assert event in lifecycle
    assert "MUST NOT replace current lifecycle status" in lifecycle
    for boundary in (
        "accepted Knowledge Version",
        "publication candidate",
        "publication authorization",
        "public repository state",
        "Git tag",
        "GitHub Release",
        "package publication",
        "knowledge publication",
    ):
        assert boundary in publication
    assert "MUST NOT create scientific meaning" in publication


def test_representation_and_membership_do_not_create_or_transfer_knowledge() -> None:
    representation = _class("representation")
    membership = _class("package-membership")
    for view in (
        "Markdown",
        "Explorer",
        "Lab",
        "future Runtime",
        "API",
        "export",
        "PDF",
        "translation",
        "mobile",
    ):
        assert view in representation
    for responsibility in (
        "source Asset version",
        "representation purpose",
        "Representation Version",
        "language",
        "transformation responsibility",
        "known omissions",
        "fidelity statement",
    ):
        assert responsibility in representation
    assert "MUST NOT automatically become a separate Asset" in representation
    assert "MUST NOT copy, mint, or transfer either identity" in membership
    assert "exact Package and Asset versions" in membership


def test_canonical_and_supporting_groups_do_not_create_importance_hierarchy() -> None:
    groups = _read(
        "docs/knowledge/object-model/models/canonical-and-supporting-objects.md"
    )
    for group in (
        "Scientific meaning carriers",
        "Evidence and provenance records",
        "Review and governance records",
        "Lifecycle and publication records",
        "View records",
    ):
        assert group in groups
    assert "MUST NOT mean optional, secondary in importance" in _normalized(groups)


def test_reference_version_and_lifecycle_models_are_complete() -> None:
    references = _read("docs/knowledge/object-model/models/object-reference-model.md")
    versions = _read("docs/knowledge/object-model/models/object-versioning-model.md")
    lifecycle = _read(
        "docs/knowledge/object-model/models/object-lifecycle-responsibility.md"
    )
    for reference in (
        "Evidence MUST reference",
        "Claim MAY reference",
        "Concept MAY reference",
        "Relationship MUST reference",
        "Review MUST bind",
        "Finding MUST reference",
        "Decision MUST reference",
        "Publication Record MUST reference",
        "Representation MUST reference",
        "Package Membership MUST reference",
    ):
        assert reference in references
    assert "Floating references are prohibited" in references
    assert "immutable conceptual events" in versions
    assert "choosing version syntax" in versions
    for authority in (
        "Lifecycle owner",
        "Review and acceptance authority",
        "Correction and supersession",
        "Archive behavior",
    ):
        assert authority in lifecycle
    assert "does not automatically possess" in lifecycle


def test_all_four_conceptual_graphs_exist_and_prohibit_inference() -> None:
    graph_paths = tuple(
        path for path in KNOWLEDGE_OBJECT_MODEL_DOCUMENTS if "/graphs/" in path
    )
    assert len(graph_paths) == 4
    for path in graph_paths:
        text = _read(path)
        normalized = _normalized(text).casefold()
        assert "```mermaid" in text
        assert "inferred" in normalized or "inference" in normalized
        assert re.search(r"(?:defines|creates) no", normalized)


def test_digital_twin_mapping_keeps_views_from_owning_meaning() -> None:
    model = _read("docs/knowledge/object-model/knowledge-object-model.md")
    normalized = _normalized(model)
    for view in ("Knowledge Lab", "Knowledge Explorer", "future Runtime"):
        assert view in normalized
    assert "No view owns underlying meaning" in normalized
    assert "same object identity and exact version" in normalized


def test_fictional_networks_cover_valid_and_invalid_boundaries() -> None:
    valid = _read(
        "docs/knowledge/object-model/examples/fictional-complete-object-network.md"
    )
    invalid = _read(
        "docs/knowledge/object-model/examples/fictional-invalid-object-network.md"
    )
    for object_name in (
        "Source",
        "Evidence",
        "Claim",
        "Concept",
        "Terminology",
        "Relationship",
        "Review",
        "Finding",
        "Decision",
        "Lifecycle Event",
        "Publication Record",
        "Representation",
        "Package Membership",
    ):
        assert object_name in valid
    for defect in (
        "duplicates Concept identity",
        "collapses Evidence and Claim",
        "makes a Term the identity",
        "No Relationship Object exists",
        "without a Review",
        "without authorization",
        "Representation",
        "floating ambiguous version",
    ):
        assert defect in invalid


def test_object_model_is_implementation_neutral_and_domain_safe() -> None:
    text = _all()
    for construct in (
        "CREATE TABLE",
        '"type": "object"',
        "class SourceObject",
        "class KnowledgeObject",
        "@dataclass",
        "openapi:",
        "schema_version:",
        "primary_key:",
    ):
        assert construct not in text
    for real_content in (
        "Oryza sativa",
        "Zea mays",
        "Manihot esculenta",
        "glyphosate",
        "chlorantraniliprole",
    ):
        assert real_content.casefold() not in text.casefold()
    assert "inference remains prohibited" in text.casefold()


def test_documentation_links_counts_and_engineering_contracts_remain_stable() -> None:
    assert len(verify()) == 618
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165
    assert (ROOT / "cpmoakb" / "runtime_api.py").is_file()

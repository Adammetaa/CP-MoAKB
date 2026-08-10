from __future__ import annotations

from scripts.verify_documentation import (
    KNOWLEDGE_SOURCE_OPERATIONS_DOCUMENTS,
    ROOT,
    verify,
)
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _all() -> str:
    return " ".join(
        "\n".join(_read(path) for path in KNOWLEDGE_SOURCE_OPERATIONS_DOCUMENTS)
        .replace("\n> ", "\n")
        .split()
    )


def test_source_operations_family_is_complete_and_governed() -> None:
    assert len(KNOWLEDGE_SOURCE_OPERATIONS_DOCUMENTS) == 8
    assert all(
        (ROOT / path).is_file() for path in KNOWLEDGE_SOURCE_OPERATIONS_DOCUMENTS
    )
    assert len(verify()) == 635


def test_operational_lifecycle_is_complete_and_nonautomatic() -> None:
    text = _all()
    for stage in (
        "Official Source",
        "Acquire",
        "Integrity Verification",
        "Rights Verification",
        "Catalog Registration",
        "Ready for Extraction",
        "Archive / Superseded",
    ):
        assert stage in text
    assert "No transition is automatic" in text
    assert "silently overwritten" in text


def test_every_source_has_one_conceptual_manifest_without_schema() -> None:
    text = _read("docs/knowledge/source-operations/source-manifest-architecture.md")
    assert "Every governed Source has one conceptual manifest" in text
    for item in (
        "Source Identity",
        "title",
        "publisher",
        "authority",
        "version/edition/revision",
        "language",
        "jurisdiction",
        "rights",
        "coverage",
        "retrieval/acquisition provenance",
        "integrity metadata",
        "supersession references",
    ):
        assert item in text
    for prohibited in ("JSON", "YAML", "XML", "schema", "API", "table"):
        assert prohibited in text


def test_repository_organization_is_conceptual_not_physical() -> None:
    text = _read("docs/knowledge/source-operations/source-repository-organization.md")
    for group in (
        "Raw Sources",
        "Working Sources",
        "Governed Sources",
        "Pending Rights",
        "Rejected Sources",
        "Archived Sources",
        "Superseded Sources",
    ):
        assert group in text
    assert "not folders or storage" in text
    assert "prescribes no directory" in text


def test_passage_identity_precedes_and_remains_separate_from_evidence() -> None:
    text = " ".join(
        _read("docs/knowledge/source-operations/passage-identity-model.md").split()
    )
    assert "Passage is not Evidence" in text
    assert "one exact Source version" in text
    for responsibility in (
        "citation",
        "page/section/paragraph",
        "review status",
        "traceability history",
    ):
        assert responsibility in text
    assert "Evidence arises later through KES" in text
    assert "defines no identifier syntax" in text


def test_extraction_and_package_readiness_are_objective_and_separate() -> None:
    extraction = _read("docs/knowledge/source-operations/extraction-readiness.md")
    matrix = _read(
        "docs/knowledge/source-operations/golden-package-readiness-matrix.md"
    )
    for criterion in (
        "identity and version",
        "retrieval provenance",
        "authority scope",
        "rights",
        "integrity",
        "manifest",
        "catalog registration",
        "stable page/section/passage addressing",
    ):
        assert criterion in extraction
    for family in (
        "Sources",
        "Passages",
        "Evidence",
        "Claims",
        "Concepts",
        "Terminology",
        "Relationships",
        "Knowledge Assets",
        "Package Memberships",
        "Publication",
    ):
        assert family in matrix
    assert "populates no Package or object" in matrix


def test_production_roadmap_and_architecture_boundaries_are_complete() -> None:
    text = _all()
    for stage in (
        "Governed Source",
        "Knowledge Extraction",
        "Evidence",
        "Claim",
        "Knowledge Objects",
        "Canonical Knowledge Package",
        "Review",
        "Publication Authorization",
        "Knowledge Explorer",
        "SPA Assistant",
        "Investigation Engine",
    ):
        assert stage in text
    for construct in (
        '"type": "object"',
        "CREATE TABLE",
        "class SourceManifest",
        "schema_version:",
        "openapi:",
    ):
        assert construct not in text
    assert "No additional architecture or Runtime sprint is required" in text
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165

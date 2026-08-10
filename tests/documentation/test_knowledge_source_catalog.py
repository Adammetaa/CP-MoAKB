from __future__ import annotations

from scripts.verify_documentation import (
    KNOWLEDGE_SOURCE_CATALOG_DOCUMENTS,
    ROOT,
    verify,
)
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _all() -> str:
    return " ".join(
        "\n".join(_read(path) for path in KNOWLEDGE_SOURCE_CATALOG_DOCUMENTS).split()
    )


def test_complete_source_catalog_family_is_governed() -> None:
    assert len(KNOWLEDGE_SOURCE_CATALOG_DOCUMENTS) == 12
    assert all((ROOT / path).is_file() for path in KNOWLEDGE_SOURCE_CATALOG_DOCUMENTS)
    assert len(verify()) == 604


def test_source_definition_and_owned_responsibilities_are_explicit() -> None:
    text = _all()
    assert (
        "A Governed Source is the authoritative representation of one reference" in text
    )
    for responsibility in (
        "identity",
        "authority",
        "publisher",
        "edition/version",
        "jurisdiction",
        "rights",
        "availability",
        "coverage",
        "status",
        "retrieval history",
        "supersession",
    ):
        assert responsibility in text
    assert "This family creates no Source Object class" in text
    for prohibited in ("Evidence", "Claim", "Concept", "Relationship"):
        assert prohibited in text


def test_status_coverage_authority_rights_and_version_models_are_complete() -> None:
    text = _all()
    for status in (
        "Available",
        "Partially Available",
        "Unavailable",
        "Pending Acquisition",
        "Pending Rights",
        "Pending Review",
        "Retired",
        "Superseded",
    ):
        assert status in text
    for authority in (
        "Publisher",
        "Scientific Authority",
        "Regulatory Authority",
        "Terminology Authority",
        "Classification Authority",
        "Review Authority",
        "Publication Authority",
    ):
        assert authority in text
    for right in (
        "citation",
        "bounded quotation",
        "redistribution",
        "internal use",
        "review use",
        "public representation",
    ):
        assert right in text
    assert "Coverage does not imply authoring readiness" in text
    assert "Source Version remains separate" in text


def test_inventory_is_minimal_real_and_does_not_invent_readiness() -> None:
    catalog = _read("docs/knowledge/source-catalog/source-catalog.md")
    assert "IRAC Mode of Action Classification Scheme v11.5" in catalog
    assert "Thai Rice Department disease material" in catalog
    assert "SOURCE MATERIAL REQUIRED" in catalog
    assert "AUTHORING INPUT PENDING" in catalog
    assert "not authoring-ready" in catalog


def test_traceability_selection_and_golden_handoff_preserve_boundaries() -> None:
    text = _all()
    assert "Source -> Evidence -> Claim -> Concept -> Package -> Website" in text
    assert "Do not select by convenience" in text
    assert "cannot yet complete a real Golden Rice Package" in text
    assert (
        "No scientific content, Evidence, Claim, Concept, Relationship, or Package"
        in text
    )


def test_examples_and_engineering_boundaries_are_safe() -> None:
    valid = _read("docs/knowledge/source-catalog/examples/fictional-valid-source.md")
    invalid = _read(
        "docs/knowledge/source-catalog/examples/fictional-invalid-source.md"
    )
    normalized_invalid = " ".join(invalid.split())
    assert "S-Lantern" in valid and "copies no source text" in valid
    for defect in (
        "filename is used as identity",
        "copyrighted text is copied",
        "chat is treated as scientific authority",
        "product Recommendation",
    ):
        assert defect in normalized_invalid
    text = _all()
    for construct in (
        '"type": "object"',
        "CREATE TABLE",
        "class GovernedSource",
        "schema_version:",
        "openapi:",
    ):
        assert construct not in text
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165

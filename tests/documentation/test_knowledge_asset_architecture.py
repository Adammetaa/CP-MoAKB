from __future__ import annotations

import re
from pathlib import Path

from scripts.verify_documentation import KNOWLEDGE_ARCHITECTURE_DOCUMENTS, ROOT, verify
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _all() -> str:
    return "\n".join(_read(relative) for relative in KNOWLEDGE_ARCHITECTURE_DOCUMENTS)


def _normalized(text: str) -> str:
    return " ".join(text.split())


def test_architecture_document_family_is_complete_and_governed() -> None:
    assert KNOWLEDGE_ARCHITECTURE_DOCUMENTS == (
        "docs/knowledge/architecture/README.md",
        "docs/knowledge/architecture/knowledge-philosophy.md",
        "docs/knowledge/architecture/knowledge-asset-and-package-model.md",
        "docs/knowledge/architecture/identity-version-reference-and-namespace-model.md",
        "docs/knowledge/architecture/representation-repository-and-evolution-model.md",
    )
    for relative in KNOWLEDGE_ARCHITECTURE_DOCUMENTS:
        assert (ROOT / relative).is_file()


def test_authority_hierarchy_is_explicit_without_supersession() -> None:
    text = _all()
    for authority in (
        "Knowledge Constitution",
        "ADR-005",
        "ADR-006",
        "ADR-008",
        "ADR-009",
        "KAS",
        "KGS",
        "Design Freeze",
        "Source Policy",
        "Publication Boundary",
        "RAS",
    ):
        assert authority in text
    index = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[0])
    assert "subordinate to the Constitution and accepted ADRs" in _normalized(index)
    assert "MUST NOT amend ADR-006" in index
    assert "MUST NOT" in index and "generalize" in index and "ADR-009" in index


def test_knowledge_philosophy_defines_every_epistemic_category_separately() -> None:
    philosophy = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[1])
    for heading in (
        "### Knowledge",
        "### What Is Not Knowledge",
        "### Information",
        "### Evidence",
        "### Claim",
        "### Concept",
        "### Relationship",
        "### Representation",
        "### Package",
        "### Publication",
        "### Version",
        "### Identity",
        "### Authority",
        "### Provenance",
        "### Lifecycle",
    ):
        assert heading in philosophy
    assert "Evidence is not the claim" in philosophy
    assert "accepted claim is not automatically published" in philosophy


def test_knowledge_asset_is_the_canonical_object_with_complete_governance() -> None:
    model = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[2])
    assert "Knowledge Asset" in model
    assert "canonical, stable-identity, independently governed" in model
    for responsibility in (
        "stable identity",
        "semantic nucleus",
        "linked evidence",
        "lifecycle",
        "review state",
        "publication state",
        "auditable history",
        "Ownership and Authority",
        "Knowledge Asset Non-goals",
    ):
        assert responsibility in model


def test_package_model_defines_boundary_manifest_lifecycle_and_contents() -> None:
    model = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[2])
    normalized = _normalized(model).casefold()
    for requirement in (
        "### Package Boundary",
        "### Package Manifest",
        "### What Belongs in a Package",
        "### What Never Belongs as Package Knowledge",
        "### Package Lifecycle and History",
        "### Package Publication",
        "Package Version",
        "package ownership",
        "Package history",
        "Retirement",
        "archive",
    ):
        assert requirement.casefold() in normalized
    assert (
        "An asset MAY appear in multiple packages by exact version reference"
        in _normalized(model)
    )
    assert "Package membership MUST NOT duplicate the asset" in _normalized(model)


def test_object_graph_preserves_separate_governed_objects() -> None:
    model = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[2])
    for node in (
        "Knowledge Package",
        "Knowledge Asset",
        "Concept",
        "Claim",
        "Evidence",
        "Source",
        "Authority",
        "Review",
        "Decision",
        "Publication",
    ):
        assert f'["{node}"]' in model
    assert "MUST NOT imply ownership, truth" in model


def test_one_asset_many_representations_and_digital_twin_are_complete() -> None:
    representation = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[4])
    for view in (
        "Markdown",
        "Knowledge Explorer",
        "Knowledge Lab",
        "Future Runtime",
        "Future Export",
        "Future API",
        "Future PDF",
        "Future Search",
        "Future Translation",
        "Future Mobile",
    ):
        assert view in representation
    assert "Same Asset; exact semantic basis; different governed view" in representation
    assert "never duplicated" in representation
    assert "does not mean a selected synchronization technology" in representation


def test_stable_identity_is_independent_of_names_locations_and_technology() -> None:
    identity = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[3])
    normalized = _normalized(identity)
    for requirement in (
        "Stable IDs",
        "Human Labels",
        "File Names and Folder Names",
        "URLs",
        "Translations",
        "Version IDs",
        "Publication IDs",
        "rename",
        "repository, folder, or filename restructuring",
        "future implementation changes",
        "non-reused",
    ):
        assert requirement in normalized
    assert (
        "specifies no characters, separators, length, sequence, or resolver"
        in normalized
    )


def test_version_axes_are_complete_and_never_mixed() -> None:
    identity = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[3])
    normalized = _normalized(identity)
    for axis in (
        "Knowledge Version",
        "Package Version",
        "Representation Version",
        "Publication Version",
        "Review Version",
        "Authority Version",
    ):
        assert axis in identity
    assert "version axes MUST remain separate" in normalized
    assert "MUST NOT use an ambiguous word" in normalized


def test_reference_model_defines_all_reference_meanings() -> None:
    identity = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[3])
    for reference in (
        "Internal Reference",
        "External Reference",
        "Cross-Package Reference",
        "Citation",
        "Evidence Link",
        "Relationship Link",
        "Publication Link",
        "Review Link",
        "Authority Link",
    ):
        assert f"**{reference}:**" in identity
    assert "silently selecting a similar target" in _normalized(identity)


def test_namespace_model_scales_without_domain_population() -> None:
    identity = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[3])
    normalized = _normalized(identity)
    for namespace in (
        "Rice",
        "Corn",
        "Cassava",
        "Vegetable",
        "Fruit",
        "global governance scope",
        "domain scopes",
    ):
        assert namespace in normalized
    assert "do not create domain inventories" in normalized
    assert (
        "adding governed namespaces, not by changing existing identifiers" in normalized
    )


def test_repository_model_long_term_evolution_and_ownership_are_explicit() -> None:
    representation = _read(KNOWLEDGE_ARCHITECTURE_DOCUMENTS[4])
    for requirement in (
        "Knowledge Repository",
        "Knowledge Packages",
        "Knowledge Asset versions",
        "Representations",
        "Views",
        "Exports or Publications",
        "Rice Pilot",
        "Crop Protection",
        "Multi Crop",
        "Global Knowledge Platform",
        "Runtime Owns",
        "Knowledge Owns",
        "Knowledge Explorer Owns",
        "Knowledge Lab Owns",
        "Publication Owns",
    ):
        assert requirement in representation
    assert "ownership scopes MUST NOT overlap" in representation


def test_architecture_remains_implementation_independent_and_schema_free() -> None:
    text = _all()
    normalized = _normalized(text)
    for implementation_construct in (
        "CREATE TABLE",
        '"type": "object"',
        "class KnowledgeAsset",
        "@dataclass",
        "openapi:",
        "schema_version:",
        "primary_key:",
    ):
        assert implementation_construct not in text
    assert "No option is selected or preferred here" in normalized
    assert "defines no keys, order, syntax, or serialization" in normalized
    assert "creates no identifier, registry, resolver" in normalized


def test_examples_are_fictional_domain_neutral_and_non_operational() -> None:
    text = _all()
    for fictional_name in (
        "Concept Lumen",
        "Package **Aurora**",
        "asset **K-Lantern**",
        "asset **K-Prism V-Five**",
    ):
        assert fictional_name in text
    for real_content in (
        "Oryza sativa",
        "Zea mays",
        "Manihot esculenta",
        "glyphosate",
        "chlorantraniliprole",
    ):
        assert real_content.casefold() not in text.casefold()
    assert not re.search(r"\b(?:diagnose|treat|apply)\s+K-", text, re.IGNORECASE)


def test_engineering_contracts_and_governed_count_remain_stable() -> None:
    assert len(verify()) == 687
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165
    assert (ROOT / "cpmoakb" / "runtime_api.py").is_file()
    assert not any(
        Path(relative).parts[0] == "cpmoakb"
        for relative in KNOWLEDGE_ARCHITECTURE_DOCUMENTS
    )

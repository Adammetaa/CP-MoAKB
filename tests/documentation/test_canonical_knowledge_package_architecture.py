from __future__ import annotations

from scripts.verify_documentation import (
    CANONICAL_KNOWLEDGE_PACKAGE_DOCUMENTS,
    ROOT,
    verify,
)
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _all() -> str:
    return "\n".join(_read(path) for path in CANONICAL_KNOWLEDGE_PACKAGE_DOCUMENTS)


def test_complete_ckp_family_exists_and_is_governed() -> None:
    assert len(CANONICAL_KNOWLEDGE_PACKAGE_DOCUMENTS) == 36
    assert all(
        (ROOT / path).is_file() for path in CANONICAL_KNOWLEDGE_PACKAGE_DOCUMENTS
    )
    assert len(verify()) == 649


def test_ckp_is_composition_not_duplicated_knowledge() -> None:
    readme = _read(CANONICAL_KNOWLEDGE_PACKAGE_DOCUMENTS[0])
    architecture = _read(CANONICAL_KNOWLEDGE_PACKAGE_DOCUMENTS[1])
    boundary = _read("docs/knowledge/package-architecture/package-boundary.md")
    normalized_boundary = " ".join(boundary.split())
    assert "Canonical Knowledge Package (CKP)" in readme
    assert "exact versions of canonical Knowledge Assets" in readme
    assert "MUST NOT become one giant duplicated record" in " ".join(
        architecture.split()
    )
    assert "Source is not Package" in normalized_boundary
    assert "Evidence is not Package" in normalized_boundary
    assert "Package Membership selects exact governed versions" in normalized_boundary


def test_all_required_profiles_exist() -> None:
    text = _read("docs/knowledge/package-architecture/profiles/README.md")
    for profile in (
        "Generic Organism",
        "Disease",
        "Insect / Pest",
        "Weed",
        "Active Ingredient",
        "Mode of Action",
        "Growth Stage",
        "Management Option",
    ):
        assert profile in text
    disease = _read(
        "docs/knowledge/package-architecture/profiles/disease-package-profile.md"
    )
    insect = _read(
        "docs/knowledge/package-architecture/profiles/insect-package-profile.md"
    )
    active = _read(
        "docs/knowledge/package-architecture/profiles/active-ingredient-package-profile.md"
    )
    moa = _read(
        "docs/knowledge/package-architecture/profiles/mode-of-action-package-profile.md"
    )
    assert "FRAC Relationships" in disease
    assert "IRAC Relationships" in insect and "remain separable" in insect
    assert "Registration does not equal Recommendation" in active
    assert "Historic registration MUST NOT be" in active
    assert "IRAC, FRAC, and HRAC remain separate" in moa


def test_all_five_consumer_contracts_and_boundaries_exist() -> None:
    summary = _read("docs/knowledge/package-architecture/package-consumer-contracts.md")
    for consumer in (
        "Website / Knowledge Explorer",
        "SPA Assistant",
        "Investigation Engine",
        "Human Review",
        "Future AI",
    ):
        assert consumer in summary
    spa = _read(
        "docs/knowledge/package-architecture/consumers/spa-assistant-consumer.md"
    )
    investigation = _read(
        "docs/knowledge/package-architecture/consumers/investigation-engine-consumer.md"
    )
    ai = _read("docs/knowledge/package-architecture/consumers/future-ai-consumer.md")
    assert "MUST NOT confirm Diagnosis" in spa
    assert "Observation -> Diagnosis" in investigation
    assert "chat transcript" in ai
    assert "MUST NOT be canonical Knowledge or Evidence" in ai


def test_evidence_relationship_dependency_and_rights_contracts() -> None:
    evidence = " ".join(
        _read("docs/knowledge/package-architecture/package-evidence-binding.md").split()
    )
    composition = _read(
        "docs/knowledge/package-architecture/package-composition-model.md"
    )
    relationships = _read(
        "docs/knowledge/package-architecture/package-relationship-model.md"
    )
    rights = _read(
        "docs/knowledge/package-architecture/package-rights-and-provenance.md"
    )
    assert (
        "Package -> Member Asset -> Claim -> Evidence -> Source -> Authority"
        in evidence
    )
    for role in (
        "supporting",
        "contradicting",
        "limiting",
        "unavailable",
        "outdated",
        "superseded",
        "jurisdiction-limited",
    ):
        assert role in evidence
    assert "direct dependency" in composition and "optional dependency" in composition
    assert "Circular Package dependencies are prohibited" in composition
    assert "MUST NOT create a Relationship automatically" in relationships
    assert "copyright" in rights and "MUST NOT copy full copyrighted" in rights


def test_inventory_candidates_plan_and_examples_are_safe() -> None:
    inventory = _read(
        "docs/knowledge/package-architecture/source-inventory/repository-source-readiness.md"
    )
    candidates = _read(
        "docs/knowledge/package-architecture/initial-package-candidate-register.md"
    )
    plan = _read("docs/knowledge/package-architecture/first-golden-package-plan.md")
    valid = _read(
        "docs/knowledge/package-architecture/examples/fictional-valid-package.md"
    )
    invalid = _read(
        "docs/knowledge/package-architecture/examples/fictional-invalid-package.md"
    )
    assert "Thai Rice Department disease material" in inventory
    assert "IRAC reference material | YES" in inventory
    assert "Rice Blast" in candidates and "candidate only" in candidates
    assert "SOURCE MATERIAL REQUIRED" in plan
    assert "Package Aurora" in valid and "exact fictional Assets" in valid
    for defect in (
        "copies a Source text wholesale",
        "ChatGPT answer as Evidence",
        "UI copy",
        "floating member/dependency versions",
        "publication without authorization",
    ):
        assert defect in invalid


def test_no_schema_runtime_real_knowledge_or_public_api_change() -> None:
    text = _all()
    for construct in (
        '"type": "object"',
        "CREATE TABLE",
        "class CanonicalKnowledgePackage",
        "schema_version:",
        "openapi:",
    ):
        assert construct not in text
    assert "not a production schema" in text
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165

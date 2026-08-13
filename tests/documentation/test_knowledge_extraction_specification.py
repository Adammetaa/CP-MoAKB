from __future__ import annotations

from scripts.verify_documentation import KNOWLEDGE_EXTRACTION_DOCUMENTS, ROOT, verify
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS

PIPELINE = (
    "Source -> Section -> Relevant Passage -> Citation -> Evidence Candidate -> "
    "Evidence Review -> Claim Candidate -> Claim Review -> Concept Candidate -> "
    "Terminology Candidate -> Relationship Candidate -> Knowledge Objects -> "
    "Package Membership Proposal -> Review Queue"
)


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _all() -> str:
    return " ".join(
        "\n".join(_read(path) for path in KNOWLEDGE_EXTRACTION_DOCUMENTS).split()
    )


def test_complete_kes_family_is_governed() -> None:
    assert len(KNOWLEDGE_EXTRACTION_DOCUMENTS) == 17
    assert all((ROOT / path).is_file() for path in KNOWLEDGE_EXTRACTION_DOCUMENTS)
    assert len(verify()) == 685


def test_pipeline_is_complete_ordered_and_cannot_skip() -> None:
    specification = " ".join(
        _read("docs/knowledge/extraction/knowledge-extraction-specification.md")
        .replace("\n> ", "\n")
        .split()
    )
    assert PIPELINE in specification
    assert "No stage may skip another" in specification
    assert "may produce zero candidates and stop" in specification


def test_object_and_publication_separations_are_explicit() -> None:
    text = _all()
    for separation in (
        "Evidence is not Claim",
        "Claim is not Concept",
        "Concept is not Package",
        "Package is not Publication",
    ):
        assert separation in text
    assert "Evidence must never become Claim automatically" in text
    assert "Membership proposal must never imply acceptance" in text


def test_all_authoring_phases_and_quality_controls_exist() -> None:
    text = _all()
    for responsibility in (
        "document scope",
        "Relevant Passage",
        "zero, one, or multiple Claim Candidates",
        "Concepts must never be invented from terminology alone",
        "accepted term",
        "preferred term",
        "synonym",
        "field term",
        "deprecated term",
        "translation",
        "same Package",
        "Package Membership Proposal",
    ):
        assert responsibility in text
    for quality in (
        "missing Evidence",
        "ambiguous wording",
        "unsupported certainty",
        "conflicting Source material",
        "multiple interpretations",
        "rights limitation",
        "incomplete Citation",
    ):
        assert quality in text


def test_diagnosis_recommendation_chat_and_automation_are_prohibited() -> None:
    prohibited = _read("docs/knowledge/extraction/governance/prohibited-shortcuts.md")
    for shortcut in (
        "ChatGPT memory or chat transcript as Evidence",
        "automatic summarization",
        "automatic ontology generation",
        "automatic Diagnosis or Recommendation",
        "hallucinated Relationships, Concepts, or Terminology",
    ):
        assert shortcut in prohibited


def test_relationships_require_evidence_not_layout() -> None:
    text = _read("docs/knowledge/extraction/phases/relationship-authoring.md")
    assert "created only when reviewed Evidence supports" in text
    for shortcut in ("Navigation", "adjacency", "same page", "same Package"):
        assert shortcut in text
    assert "must never imply a Relationship" in text


def test_examples_are_fictional_and_architecture_is_implementation_neutral() -> None:
    paper = _read("docs/knowledge/extraction/examples/fictional-paper.md")
    errors = _read("docs/knowledge/extraction/examples/fictional-errors.md")
    assert "entirely fictional, domain-neutral" in paper
    assert "No real organism, crop, chemical, disease, or management fact" in paper
    assert "ChatGPT memory as Evidence" in errors
    text = _all()
    for construct in (
        '"type": "object"',
        "CREATE TABLE",
        "class KnowledgeExtraction",
        "schema_version:",
        "openapi:",
    ):
        assert construct not in text
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165

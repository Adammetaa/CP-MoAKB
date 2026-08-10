from __future__ import annotations

from scripts.verify_documentation import (
    KNOWLEDGE_EVIDENCE_PILOT_DOCUMENTS,
    ROOT,
    verify,
)
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS

SOURCE_HASH = "9cd74da88828fbc6d5dcbfdfbcaa0a20e45752a7f21a7d8503b1263d8a6eef2d"


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _all() -> str:
    return " ".join(
        "\n".join(_read(path) for path in KNOWLEDGE_EVIDENCE_PILOT_DOCUMENTS)
        .replace("\n> ", "\n")
        .split()
    )


def test_exactly_one_real_source_and_two_candidates_are_governed() -> None:
    assert len(KNOWLEDGE_EVIDENCE_PILOT_DOCUMENTS) == 6
    assert all((ROOT / path).is_file() for path in KNOWLEDGE_EVIDENCE_PILOT_DOCUMENTS)
    text = _all()
    assert text.count("# Governed Source Record:") == 1
    assert text.count("# Evidence Candidate EC-GOLDEN-") == 2
    assert len(verify()) == 635


def test_source_identity_version_authority_rights_and_provenance_are_explicit() -> None:
    text = _read("docs/knowledge/evidence-pilot/governed-source-record.md")
    for required in (
        "GS-RICE-DISEASES-001",
        "โรคข้าวที่สำคัญ",
        "ผศ.ดร.อุดมศักดิ์ เลิศสุชาตวนิช",
        "มหาวิทยาลัยเกษตรศาสตร์",
        SOURCE_HASH,
        "Authority Scope",
        "Rights and Availability",
        "Project Owner-provided local Source Packet",
        "one-based PDF page",
        "not independently verified",
    ):
        assert required in text


def test_every_candidate_has_exact_traceability_context_and_limitations() -> None:
    for number, page, passage in (
        ("001", "PDF page 5", "P5-A"),
        ("002", "PDF page 6", "P6-A"),
    ):
        text = _read(f"docs/knowledge/evidence-pilot/evidence-candidate-{number}.md")
        for required in (
            "GS-RICE-DISEASES-001",
            SOURCE_HASH,
            page,
            passage,
            "Context and Provenance",
            "Authority Scope and Limitations",
            "Extraction Notes",
            "Evidence Review disposition: **Approved**",
        ):
            assert required in text
        assert "No passages were merged" in text or "without merging" in text


def test_review_is_fidelity_only_and_not_scientific_acceptance() -> None:
    review = _read("docs/knowledge/evidence-pilot/evidence-review-record.md")
    assert "EC-GOLDEN-001 | Approved" in review
    assert "EC-GOLDEN-002 | Approved" in review
    assert "passage fidelity and extraction-record completeness only" in review
    assert "does not mean accepted Claim" in review
    assert (
        "No contradictory statement review or external scientific validation" in review
    )


def test_pipeline_stops_at_evidence_and_creates_no_downstream_objects() -> None:
    readme = _read("docs/knowledge/evidence-pilot/README.md")
    trace = _read("docs/knowledge/evidence-pilot/traceability-record.md")
    assert "Evidence Review -> STOP" in " ".join(readme.replace("\n> ", "\n").split())
    assert "No Claim, Concept, Terminology" in trace
    assert "Relationship, Knowledge Object, Package Membership, Package" in trace
    assert "Website content" in trace
    assert "Diagnosis, Recommendation" in trace


def test_no_architecture_runtime_schema_or_public_api_change_is_encoded() -> None:
    text = _all()
    for construct in (
        '"type": "object"',
        "CREATE TABLE",
        "class EvidenceCandidate",
        "schema_version:",
        "openapi:",
    ):
        assert construct not in text
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165

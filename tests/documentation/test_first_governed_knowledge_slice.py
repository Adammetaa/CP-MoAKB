from __future__ import annotations

from scripts.verify_documentation import (
    KNOWLEDGE_GOLDEN_SLICE_DOCUMENTS,
    ROOT,
    verify,
)
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS

SOURCE_HASH = "9cd74da88828fbc6d5dcbfdfbcaa0a20e45752a7f21a7d8503b1263d8a6eef2d"


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _all() -> str:
    return "\n".join(_read(path) for path in KNOWLEDGE_GOLDEN_SLICE_DOCUMENTS)


def test_two_real_claim_candidates_have_exact_evidence_traceability() -> None:
    assert len(KNOWLEDGE_GOLDEN_SLICE_DOCUMENTS) == 7
    assert all((ROOT / path).is_file() for path in KNOWLEDGE_GOLDEN_SLICE_DOCUMENTS)
    text = _all()
    assert text.count("# Claim Candidate CL-GOLDEN-") == 2
    for required in (
        "EC-GOLDEN-001",
        "EC-GOLDEN-002",
        "GS-RICE-DISEASES-001",
        SOURCE_HASH,
        "CL-GOLDEN-001/v1",
        "CL-GOLDEN-002/v1",
    ):
        assert required in text
    assert len(verify()) == 680


def test_claim_review_is_complete_deferred_and_preserves_the_blocker() -> None:
    review = _read("docs/knowledge/golden-knowledge-slice/claim-review-record.md")
    issue = _read("docs/knowledge/golden-knowledge-slice/unresolved-issue.md")
    for required in (
        "Evidence fidelity",
        "Source-authority fit",
        "Unsupported certainty",
        "Conflicting Evidence",
        "Translation/terminology",
        "Scientific competence boundary",
        "Decision: **defer**",
        "F-GOLDEN-001",
    ):
        assert required in review
    assert "UI-GOLDEN-001" in issue
    assert "blocks scientific approval" in issue
    assert "Closure evidence required" in issue


def test_unsupported_downstream_objects_and_package_proposal_are_absent() -> None:
    readme = _read("docs/knowledge/golden-knowledge-slice/README.md")
    for required in (
        "Concept Candidate | zero objects",
        "Terminology Candidate | zero objects",
        "Relationship Candidate | zero objects",
        "Package Membership Proposal | zero proposals",
    ):
        assert required in readme
    assert "WEBSITE KNOWLEDGE NOT READY" in _read(
        "docs/knowledge/golden-knowledge-slice/architecture-review.md"
    )


def test_architecture_runtime_schema_and_api_boundaries_are_unchanged() -> None:
    review = _read("docs/knowledge/golden-knowledge-slice/architecture-review.md")
    for required in (
        "New architecture created: NO",
        "Runtime changed: NO",
        "Schema changed: NO",
        "Public API changed: NO",
        "Design Freeze changed: NO",
        "Diagnosis authored: NO",
        "Recommendation authored: NO",
        "Unsupported inference introduced: NO",
        "Package accepted: NO",
        "Published: NO",
    ):
        assert required in review
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165

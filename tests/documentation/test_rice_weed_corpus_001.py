from __future__ import annotations

from pathlib import Path

from scripts.verify_documentation import verify

ROOT = Path(__file__).parents[2]
CORPUS = ROOT / "docs" / "knowledge" / "rice-weed-corpus-001"
DOCUMENTS = {
    "README.md",
    "source-intake-and-inventory.md",
    "evidence-and-claims.md",
    "canonical-records.md",
    "packages-views-and-traceability.md",
    "reconciliation-review-and-issues.md",
}


def _text() -> str:
    return "\n".join(
        path.read_text(encoding="utf-8") for path in sorted(CORPUS.glob("*.md"))
    )


def test_source_and_evidence_are_exact_and_authority_scoped() -> None:
    text = _text()
    assert {path.name for path in CORPUS.glob("*.md")} == DOCUMENTS
    assert "GS-DOA-HAZARDOUS-SALES-2019-001/v1" in text
    assert "9b2a14d7ba2bcc5bc6bde236af406df64d42f9ac109c1f43b3e7923113b0ff22" in text
    assert "GS-DOA-HAZARDOUS-REGISTRY-2026-001/v1" in text
    assert "8b28fcfa31a40a021645645a33864fe858769af8f2264db22776e549df6916fe" in text
    assert "printed pp.3-44 to\n3-55" in text
    assert "does not establish rice use" in text


def test_all_weeds_packages_views_and_relationships_are_governed() -> None:
    text = _text()
    for name in (
        "หญ้าข้าวนก",
        "หญ้าดอกขาว",
        "หญ้านกสีชมพู",
        "ผักปอดนา",
        "เทียนนา",
        "กกขนาก",
        "กกทราย",
        "หนวดปลาดุก",
    ):
        assert name in text
    assert (
        "CL-RWC-008-I/v1" in text
        and "CL-RWC-008-G/v1" in text
        and "CL-RWC-008-C/v1" in text
    )
    assert "EV-RWC-001/v1" in text and "EV-RWC-008/v1" in text
    assert "CO-RWC-008/v1" in text and "TM-RWC-008/v1" in text
    assert "RL-RWC-019/v1" in text
    assert "CKP-RWC-008/v1" in text and "WV-RWC-008/v1" in text


def test_investigation_resistance_hrac_and_recommendation_boundaries_hold() -> None:
    text = _text()
    assert "IQ-RWC-001/v1" in text and "IQ-RWC-013/v1" in text
    assert (
        "Failed control" in text and "Possible resistance remains a Hypothesis" in text
    )
    assert "HRAC official material was not available" in text
    assert "dose escalation" in text and "Recommendation" in text
    assert "No new architecture" in text


def test_documentation_verifier_includes_weed_corpus() -> None:
    assert len(verify()) == 680

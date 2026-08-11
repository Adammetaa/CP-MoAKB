from __future__ import annotations

from pathlib import Path

from scripts.verify_documentation import verify

ROOT = Path(__file__).parents[2]
CORPUS = ROOT / "docs" / "knowledge" / "rice-insect-corpus-001"
DOCUMENTS = {
    "README.md", "source-intake-and-inventory.md", "evidence-and-claims.md",
    "canonical-records.md", "packages-views-and-traceability.md",
    "reconciliation-review-and-issues.md",
}


def _text() -> str:
    return "\n".join(path.read_text(encoding="utf-8") for path in sorted(CORPUS.glob("*.md")))


def test_source_intake_is_exact_and_authority_scoped() -> None:
    text = _text()
    assert {path.name for path in CORPUS.glob("*.md")} == DOCUMENTS
    for source, digest in (
        ("GS-RD-RICE-PESTS-2007-001/v1", "07b7d783176c499c27b6291ed2f5568f9c9d29f0c9609e68104a7a28b3080e98"),
        ("GS-CHAPMAN-INSECTS-1998-4E-001/v1", "8147532f4301441dc0891b58a84237bb01e49a4b99b117554e53ce6d243bcd91"),
        ("GS-DOA-HAZARDOUS-REGISTRY-2026-001/v1", "8b28fcfa31a40a021645645a33864fe858769af8f2264db22776e549df6916fe"),
    ):
        assert source in text and digest in text
    assert "not Thai rice-pest" in text
    assert "does not establish rice-pest use" in text
    assert "UI-RIC-001/v1" in text


def test_all_pests_claims_and_evidence_have_exact_locators() -> None:
    text = _text()
    assert text.count("| `EV-RIC-") == 19
    assert "CL-RIC-019-I/B/O/v1" in text
    assert "RD printed pp.2-3 / PDF pp.13-14" in text
    assert "RD pp.54-56 / PDF pp.65-67" in text
    assert "CKP-RIC-001/v1" in text and "CKP-RIC-019/v1" in text
    assert "WV-RIC-001/v1" in text and "WV-RIC-019/v1" in text
    assert "CO-RIC-019/v1" in text and "TM-RIC-038/v1" in text
    assert "RL-RIC-038/v1" in text


def test_natural_enemies_questions_and_investigation_boundaries_are_governed() -> None:
    text = _text()
    assert "RL-RIC-NE-001/v1" in text and "RL-RIC-NE-010/v1" in text
    assert "IQ-RIC-001/v1" in text and "IQ-RIC-009/v1" in text
    assert "no guaranteed control" in text
    assert "does not establish resistance" in text
    assert "No Diagnosis" in text
    assert "Recommendation" in text
    assert "dose escalation" in text


def test_documentation_verifier_includes_insect_corpus() -> None:
    assert len(verify()) == 676

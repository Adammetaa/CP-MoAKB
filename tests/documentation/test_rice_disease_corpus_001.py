from __future__ import annotations

from pathlib import Path

from scripts.verify_documentation import verify

ROOT = Path(__file__).parents[2]
CORPUS = ROOT / "docs" / "knowledge" / "rice-disease-corpus-001"
DOCUMENTS = (
    "README.md",
    "source-intake-and-inventory.md",
    "evidence-and-claims.md",
    "canonical-records.md",
    "packages-views-and-traceability.md",
    "reconciliation-review-and-issues.md",
)


def _all_text() -> str:
    return "\n".join((CORPUS / name).read_text(encoding="utf-8") for name in DOCUMENTS)


def test_corpus_document_set_and_source_identity_are_fixed() -> None:
    assert {path.name for path in CORPUS.glob("*.md")} == set(DOCUMENTS)
    text = _all_text()
    assert "GS-KU-RICE-DISEASES-2020-001/v1" in text
    assert "GS-RRC-PRACHIN-RICE-DISEASES-2025-001/v1" in text
    assert "9cd74da88828fbc6d5dcbfdfbcaa0a20e45752a7f21a7d8503b1263d8a6eef2d" in text
    assert "95c3922d9e559b37343d82e5cb7ea2b9305c1b35c558a617dc171eb603105deb" in text


def test_corpus_materializes_traceable_architecture_complete_records() -> None:
    text = _all_text()
    assert text.count("| `EV-RDC-") >= 16
    assert "CL-RDC-016-I/C/O/v1" in text
    assert "CO-RDC-AUX-022/v1" in text
    assert "TM-RDC-032/v1" in text
    assert "RL-RDC-032/v1" in text
    assert "CKP-RDC-001/v1" in text and "CKP-RDC-016/v1" in text
    assert "WV-RDC-001/v1" in text and "WV-RDC-016/v1" in text
    assert "CO-RDW1-001/v1" in text and "CO-RDW1-003/v1" in text
    assert text.count("RRC p") >= 10
    assert "Website disease card/detail" in text


def test_corpus_preserves_scientific_and_publication_boundaries() -> None:
    text = _all_text()
    assert "Pyricularia grisea" in text and "Pyricularia oryzae Cavara" in text
    assert "UI-RDC-002/v1" in text
    assert "UI-RDC-003/v1" in text
    assert "Diagnosis" in text
    assert "Recommendation" in text
    assert "not_published" in text


def test_documentation_verifier_includes_corpus() -> None:
    assert len(verify()) == 668

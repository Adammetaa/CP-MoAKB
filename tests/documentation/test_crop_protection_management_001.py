from __future__ import annotations

from pathlib import Path

from scripts.verify_documentation import verify

ROOT = Path(__file__).parents[2]
CORPUS = ROOT / "docs" / "knowledge" / "crop-protection-management-001"
DOCUMENTS = {
    "README.md",
    "sources-and-authority.md",
    "management-options.md",
    "active-ingredients-and-moa.md",
    "authority-completion.md",
    "failed-control-and-governance.md",
    "packages-views-and-traceability.md",
}


def _text() -> str:
    return "\n".join(
        path.read_text(encoding="utf-8") for path in sorted(CORPUS.glob("*.md"))
    )


def test_sources_and_authorities_are_exact_and_separate() -> None:
    text = _text()
    assert {path.name for path in CORPUS.glob("*.md")} == DOCUMENTS
    assert "74641b0f56bcfb46574fd0dc815ee136170af66385950ad61045a0692ea750d6" in text
    assert "9b2a14d7ba2bcc5bc6bde236af406df64d42f9ac109c1f43b3e7923113b0ff22" in text
    assert "8b28fcfa31a40a021645645a33864fe858769af8f2264db22776e549df6916fe" in text
    assert "GS-FRAC-MOA-2026-001/v1" in text
    assert "GS-HRAC-MOA-2026-001/v1" in text
    assert "UI-CPM-001/v1` and `UI-CPM-002/v1` are resolved" in text
    assert "not converted to HRAC groups" in text


def test_management_options_are_evidence_backed_and_not_recommendations() -> None:
    text = _text()
    assert "MO-CPM-001/v1" in text and "MO-CPM-007/v1" in text
    assert "EV-RIC-001/v1" in text and "EV-RWC-005/v1" in text
    assert "EV-DMG-CPM-001/v1" in text and "EV-DMG-CPM-002/v1" in text
    assert "do not select, prioritize, decide, or recommend" in text
    assert "no option is inferred" in text


def test_active_ingredients_irac_and_registration_boundaries_hold() -> None:
    text = _text()
    assert "CO-AI-CPM-001/v1" in text and "CO-AI-CPM-006/v1" in text
    assert "RL-MOA-CPM-006/v1" in text and "RL-IRAC-CPM-006/v1" in text
    for value in (
        "Carbofuran",
        "Fipronil",
        "Imidacloprid",
        "Cartap hydrochloride",
        "Buprofezin",
        "Chlorantraniliprole",
    ):
        assert value in text
    assert "No AI-to-registration/use edge is created" in text
    assert "RL-FRAC-CPM-006/v1" in text
    assert "RL-HRAC-CPM-006/v1" in text
    assert "Accepted registration relationships: **0**" in text


def test_failed_control_remains_investigation_and_architecture_is_unchanged() -> None:
    text = _text()
    assert "IQ-CPM-001/v1" in text and "IQ-CPM-016/v1" in text
    assert "No numerical resistance score" in text
    assert "dose escalation" in text
    assert "Human Review remains mandatory" in text
    assert "no new architecture family" in text


def test_documentation_verifier_includes_management_integration() -> None:
    assert len(verify()) == 679

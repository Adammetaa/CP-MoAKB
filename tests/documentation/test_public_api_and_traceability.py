from __future__ import annotations

from scripts.verify_documentation import ROOT, _manifest_packages


def test_every_governed_public_package_is_navigated() -> None:
    handbook = (ROOT / "docs" / "api" / "public-symbols.md").read_text(encoding="utf-8")
    assert len(_manifest_packages()) == 13
    for package in _manifest_packages():
        assert f"`{package}`" in handbook


def test_ras_and_adr_traceability_does_not_invent_missing_decisions() -> None:
    decision_map = (ROOT / "docs" / "governance" / "decision-map.md").read_text(
        encoding="utf-8"
    )
    assert "do not claim a direct ADR" in decision_map
    ras_index = (ROOT / "docs" / "runtime" / "specifications" / "README.md").read_text(
        encoding="utf-8"
    )
    for number in range(7, 15):
        assert f"RAS-{number:03d}" in ras_index

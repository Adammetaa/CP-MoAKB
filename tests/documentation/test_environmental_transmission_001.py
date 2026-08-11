from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).parents[2]
DOCS = ROOT / "docs" / "knowledge" / "environmental-transmission-001"
DATA = ROOT / "prototype" / "knowledge-explorer" / "assets" / "data"


def _json(name: str) -> dict:
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def test_all_diseases_have_evidence_bound_environmental_projection() -> None:
    corpus = _json("rice-disease-corpus-001.json")
    projection = corpus["environmental_transmission"]
    assert projection["status"] == "accepted-internal-not-published"
    assert len(projection["records"]) == 16
    assert {item["subject"] for item in projection["records"]} == {
        item["key"] for item in corpus["subjects"]
    }
    for record in projection["records"]:
        assert record["evidence"]
        assert record["roles"]
        assert record["distance"] in {"unknown", "not_applicable"}


def test_scientific_roles_remain_distinct() -> None:
    records = {
        item["subject"]: item
        for item in _json("rice-disease-corpus-001.json")[
            "environmental_transmission"
        ]["records"]
    }
    assert records["BLAST"]["roles"]["favorable_environment"] == [
        "high_humidity"
    ]
    assert "transmission" not in records["BLAST"]["roles"]
    assert records["BAKANAE"]["roles"]["transmission"] == ["seedborne"]
    assert records["DIRTY-PANICLE"]["roles"]["dispersal"] == ["wind"]
    assert records["RAGGED-STUNT"]["roles"]["cause"] == ["RRSV"]
    assert records["RAGGED-STUNT"]["roles"]["vector_association"] == [
        "brown_planthopper"
    ]
    assert "vector presence does not establish infection" in records[
        "RAGGED-STUNT"
    ]["limitation"]


def test_no_threshold_distance_or_radius_is_invented() -> None:
    projection = _json("rice-disease-corpus-001.json")[
        "environmental_transmission"
    ]
    assert projection["thresholds"] == []
    assert projection["operational_surveillance_radii"] == []
    assert "ยังไม่มีหลักฐานเพียงพอ" in projection["distance_policy"]
    combined = "\n".join(path.read_text(encoding="utf-8") for path in DOCS.glob("*.md"))
    assert "No numerical weather threshold" in combined
    assert "No studies are averaged" in combined
    assert "No experimental distance is" in combined


def test_weather_variables_are_subject_specific() -> None:
    records = {
        item["subject"]: item
        for item in _json("rice-disease-corpus-001.json")[
            "environmental_transmission"
        ]["records"]
    }
    assert records["BLAST"]["weather_variables"] == ["relative_humidity"]
    assert records["BACTERIAL-BLIGHT"]["weather_variables"] == [
        "rainfall",
        "wind_speed",
        "wind_direction",
    ]
    assert records["BROWN-SPOT"]["weather_variables"] == []


def test_insect_environmental_subset_is_evidence_bound() -> None:
    records = _json("rice-insect-corpus-001.json")["environmental_spatial"]
    assert records["status"] == "accepted-internal-not-published"
    assert len(records["records"]) == 13
    assert all(item["evidence"] and item["roles"] for item in records["records"])
    assert "no quantitative movement distance" in records["distance_policy"]


def test_sp_assistant_projection_is_deterministic_and_bounded() -> None:
    app = (ROOT / "prototype" / "sp-assistant" / "assets" / "app.js").read_text(
        encoding="utf-8"
    )
    assert "environmentalProfiles" in app
    assert "renderEnvironmentalContext(caseState.candidates[0])" in app
    assert "สภาพที่เอื้อ ≠ การแพร่" in app
    assert "Vector present ≠ plant infected" in app
    assert "ไม่มี live weather หรือ nearby-case lookup" in app
    for prohibited in (
        "weatherapi",
        "openweathermap",
        "risk_score",
        "infection_probability",
        "surveillance_radius",
    ):
        assert prohibited not in app.casefold()


def test_rights_traceability_and_grouped_issues_are_explicit() -> None:
    readme = (DOCS / "README.md").read_text(encoding="utf-8")
    issues = (DOCS / "relationships-and-issues.md").read_text(encoding="utf-8")
    assert "does not reproduce pages" in readme
    assert "Source records retain" in readme
    for number in range(1, 6):
        assert f"UI-ETS-00{number}/v1" in issues
    assert "Case observation ≠ Canonical Knowledge" in issues

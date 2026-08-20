from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"


def _read(path: str) -> str:
    return (ASSISTANT / path).read_text(encoding="utf-8")


def test_current_case_compares_with_structured_demo_cases() -> None:
    html = _read("legacy.html")
    app = _read("assets/app.js")
    assert "data-field-watch" in html
    assert "CURRENT CASE" in app
    assert "DEMO NEARBY CASE" in app
    assert "demoFieldCases.map(compareDemoCase)" in app
    assert app.count('provenance: "demo_fixture"') == 4


def test_demo_cases_are_unconfirmed_and_visibly_labelled() -> None:
    html = _read("legacy.html")
    app = _read("assets/app.js")
    assert "ข้อมูลจำลองสำหรับทดสอบระบบ" in html and "ข้อมูลจำลองสำหรับทดสอบระบบ" in app
    assert "candidate knowledge · unresolved" in app
    assert "not confirmed" in app
    assert "confirmed disease" not in app.casefold()


def test_haversine_distance_is_transparent_and_non_biological() -> None:
    app = _read("assets/app.js")
    html = _read("legacy.html")
    assert "function haversineDistanceKm" in app
    assert "6371.0088" in app
    assert "Math.atan2" in app
    assert "Haversine · Earth mean radius" in app
    assert "ระยะค้นหาเคสสำหรับการแสดงผล" in html
    assert "ไม่ใช่รัศมีโรค" in html
    assert "biological radius" in app


def test_temporal_and_crop_context_are_neutral() -> None:
    app = _read("assets/app.js")
    for token in (
        "function formatTimeSeparation",
        "ห่างกันประมาณ",
        "sameCrop",
        "cropAge",
        "growthStage",
    ):
        assert token in app
    for prohibited in ("infection window", "susceptibility score"):
        assert prohibited not in app.casefold()


def test_candidate_and_pathway_comparison_use_governed_context() -> None:
    app = _read("assets/app.js")
    assert "governedSpatialPathways" in app
    assert "sharedCandidates" in app
    assert "vector-associated context" in app
    assert "EV-RIC-002/v1" in app
    assert "shared Candidate ไม่ใช่ shared Diagnosis" in app
    assert "vector presence ไม่เท่ากับ infective vector" in app


def test_weather_context_remains_separately_provenanced() -> None:
    app = _read("assets/app.js")
    assert app.count('provenance: "DEMO WEATHER CONTEXT"') == 2
    assert "caseState.weatherContext && demoCase.weatherContext" in app
    assert "ทั้งสองเคสมี weather/environment context ที่แยก provenance แล้ว" in app
    assert "infection source" not in app.casefold()


def test_surveillance_states_are_explainable_without_scores() -> None:
    app = _read("assets/app.js")
    for state in (
        "ควรตรวจพื้นที่ใกล้เคียงเพิ่มเติม",
        "มีบริบทบางส่วนที่เกี่ยวข้อง",
        "ข้อมูลยังไม่พอสำหรับเชื่อมโยง",
        "ไม่พบ Knowledge ที่รองรับการเชื่อมโยงเชิงพื้นที่",
    ):
        assert state in app
    assert "เหตุผลที่แสดง" in app
    for prohibited in (
        "riskScore",
        "infectionScore",
        "probability =",
        "outbreakPrediction",
        "hotspot",
        "transmissionRadius",
    ):
        assert prohibited not in app


def test_surveillance_case_creation_preserves_operational_provenance() -> None:
    app = _read("assets/app.js")
    assert "data-start-surveillance-case" in app
    assert "function startSurveillanceCase" in app
    assert "เหตุผลที่เข้าตรวจ: เฝ้าระวังพื้นที่ใกล้เคียง" in app
    assert 'relation: "surveillance prompted by"' in app
    assert "does not imply transmission" in app
    assert "ยังไม่มี Diagnosis" in app


def test_photo_case_spatial_weather_and_handoff_regressions_are_retained() -> None:
    html = _read("legacy.html")
    app = _read("assets/app.js")
    for token in (
        "data-photo-mission-start",
        "data-case-context",
        "data-weather-request",
        "data-escalate",
    ):
        assert token in html
    for token in (
        "PHOTO MISSION",
        "FIELD CASE CONTEXT",
        "WEATHER CONTEXT",
        "NEARBY FIELD WATCH · BROWSER-LOCAL",
        "ระบบไม่ได้ยืนยันการแพร่ระหว่างเคส",
    ):
        assert token in app


def test_no_new_network_persistence_map_or_treatment_boundary() -> None:
    app = _read("assets/app.js")
    html = _read("legacy.html")
    assert "<canvas" not in html and "<svg" not in html
    for prohibited in (
        "google.maps",
        "leaflet",
        "mapbox",
        "localStorage",
        "sessionStorage",
        "indexedDB",
        "WebSocket",
        "treatment zone",
        "spray buffer",
        "pesticide recommendation",
    ):
        assert prohibited not in (app + html).casefold()
    assert app.count("fetch(") == 1
    assert "archive-api.open-meteo.com" in app


def test_mobile_field_watch_layout_is_explicit() -> None:
    styles = _read("assets/styles.css")
    assert ".watch-list" in styles
    assert "grid-template-columns:repeat(2" in styles
    assert "@media(max-width:820px)" in styles
    assert ".watch-list{grid-template-columns:1fr}" in styles

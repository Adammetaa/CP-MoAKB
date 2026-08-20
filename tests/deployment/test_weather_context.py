from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"


def _read(path: str) -> str:
    return (ASSISTANT / path).read_text(encoding="utf-8")


def test_weather_lookup_is_explicit_and_discloses_coordinate_transfer() -> None:
    html = _read("legacy.html")
    app = _read("assets/app.js")
    assert "data-weather-request" in html
    assert "การเปิดเผยข้อมูล" in html
    assert "latitude, longitude, วันที่, timezone" in html
    assert 'addEventListener("click", requestWeatherContext)' in app
    assert "requestWeatherContext();" not in app


def test_weather_requires_case_location_and_observation_time() -> None:
    app = _read("assets/app.js")
    assert "if (!caseState) return" in app
    assert 'caseState.location.status !== "captured"' in app
    assert "caseState.observationTime.value" in app
    assert (
        "caseState.createdAt"
        not in app[
            app.index("async function requestWeatherContext") : app.index(
                "function missionDomain"
            )
        ]
    )
    assert "ระบบจะไม่สร้างพิกัดจากชื่อสถานที่" in app


def test_weather_request_has_minimum_network_boundary() -> None:
    app = _read("assets/app.js")
    request = app[
        app.index("async function requestWeatherContext") : app.index(
            "function missionDomain"
        )
    ]
    assert "URLSearchParams" in request and 'timezone: "auto"' in request
    assert 'method: "GET"' in request and 'credentials: "omit"' in request
    for prohibited in (
        "selectedImages",
        "userText",
        "areaNotes",
        "candidate diagnosis",
        "chemical_history",
        "FormData",
    ):
        assert prohibited not in request


def test_historical_and_same_day_products_are_not_conflated() -> None:
    app = _read("assets/app.js")
    assert "https://archive-api.open-meteo.com/v1/archive" in app
    assert "https://api.open-meteo.com/v1/forecast" in app
    assert "localDate < todayDate" in app
    assert "ไม่ใช้ Forecast แทน Observation" in app
    assert "gridded reanalysis/model-derived historical data" in app
    assert "gridded forecast/model-derived same-day data" in app


def test_weather_provenance_units_timezone_and_resolution_are_retained() -> None:
    app = _read("assets/app.js")
    for token in (
        "provider:",
        "retrievedAt:",
        "targetLocation:",
        "targetTime:",
        "timezone:",
        "dataClass:",
        "resolution:",
        "rawValue:",
        "unit:",
    ):
        assert token in app
    assert "GPS accuracy ≠ weather grid resolution" in app
    assert "ข้อมูลนี้ไม่ใช่เซนเซอร์ที่กอข้าวจุดนี้" in app


def test_candidate_relevance_is_governed_presence_only() -> None:
    app = _read("assets/app.js")
    assert 'blast: ["relative_humidity"]' in app
    assert '"brown-spot": []' in app
    assert "governedWeatherVariables[candidate?.key]" in app
    assert "มีข้อมูลบางส่วนที่เกี่ยวข้อง" in app
    assert "ไม่มีตัวแปรที่ Knowledge ปัจจุบันรองรับเพียงพอ" in app
    assert "threshold" in app
    for prohibited in (
        "weatherScore",
        "riskScore",
        "infectionScore",
        "transmissionRadius",
        "nearbyCase",
    ):
        assert prohibited not in app


def test_manual_environment_and_provider_weather_stay_separate() -> None:
    app = _read("assets/app.js")
    assert "ผู้ใช้สังเกตในแปลง · USER" in app
    assert "Weather Data · Weather provider" in app
    assert "Governed Environmental Knowledge · CANONICAL KNOWLEDGE" in app
    assert "System Comparison" in app
    assert "caseState.cropContext.waterCondition" in app


def test_provider_failure_is_bounded_and_handoff_preserves_layers() -> None:
    app = _read("assets/app.js")
    assert "AbortController" in app and "12000" in app
    assert "เคสยังใช้งานต่อได้" in app
    for token in (
        "WEATHER CONTEXT",
        "WEATHER PROVIDER",
        "CANONICAL KNOWLEDGE",
        "SYSTEM COMPARISON",
        "Missing variables",
        "Limitations",
    ):
        assert token in app
    assert "data-weather-section" in _read("legacy.html")
    assert "data-photo-mission-start" in _read("legacy.html")


def test_provider_review_documents_class_resolution_and_attribution() -> None:
    review = (
        ROOT / "docs" / "knowledge" / "environmental-transmission-001" / "README.md"
    ).read_text(encoding="utf-8")
    for token in (
        "Open-Meteo",
        "/v1/archive",
        "hourly temporal resolution",
        "9-km",
        "0.1-degree",
        "0.25-degree",
        "not measurements",
        "attribution",
    ):
        assert token in review

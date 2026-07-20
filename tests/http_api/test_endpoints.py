from cpmoakb.application import QueryAndExplainRequest, QueryRecordsRequest

from ._support import client, runtime_service


def test_health_is_exact_stable_and_environment_free() -> None:
    http = client()
    expected = {
        "status": "ok",
        "http_api_version": "0.1",
        "application_api_version": "0.1",
        "runtime_api_version": "0.1",
        "projection_version": "1.0",
    }
    first = http.get("/health")
    second = http.get("/health")
    assert first.status_code == 200
    assert first.headers["content-type"] == "application/json"
    assert first.json() == expected == second.json()
    body = first.text.casefold()
    for prohibited in ("timestamp", "hostname", "path", "debug", "pid"):
        assert prohibited not in body


def test_query_equals_direct_approved_projection_and_is_deterministic() -> None:
    service = runtime_service()
    http = client(service)
    payload = {"label_text": "Fictional Unicode ข้อมูล"}
    direct = service.query_and_project(
        QueryRecordsRequest.from_values(label_text=payload["label_text"])
    ).projection

    first = http.post("/v1/query", json=payload)
    second = http.post("/v1/query", json=payload)
    assert first.status_code == 200
    assert first.json() == direct == second.json()
    assert "Fictional Unicode ข้อมูล" in first.text


def test_empty_query_result_is_a_successful_empty_projection() -> None:
    response = client().post("/v1/query", json={"label_text": "No fictional match"})
    assert response.status_code == 200
    assert response.json()["data"]["total_count"] == 0
    assert response.json()["data"]["matches"] == []


def test_query_and_explain_equals_direct_application_envelope() -> None:
    service = runtime_service()
    http = client(service)
    payload = {"label_text": "Fictional Unicode ข้อมูล", "match_index": 0}
    direct = service.query_explain_and_project(
        QueryAndExplainRequest(
            QueryRecordsRequest.from_values(label_text="Fictional Unicode ข้อมูล"),
            0,
        )
    ).projection

    first = http.post("/v1/query-and-explain", json=payload)
    second = http.post("/v1/query-and-explain", json=payload)
    assert first.status_code == 200
    assert first.json() == direct == second.json()
    text = first.text.casefold()
    assert "rank" not in text
    assert "recommend" not in text
    assert "diagnosis" not in text


def test_unknown_fields_types_nested_values_and_over_limits_are_rejected() -> None:
    http = client()
    invalid_payloads = (
        {"unknown": "value"},
        {"label_text": 7},
        {"label_text": {"nested": "object"}},
        {"label_text": "x" * 257},
        {"label_text": ["x"] * 2},
        {"match_index": 0},
    )
    for payload in invalid_payloads:
        response = http.post("/v1/query", json=payload)
        assert response.status_code == 422
        assert response.json() == {
            "error": {
                "code": "transport-validation-error",
                "message": "The request body violates the HTTP contract.",
            }
        }


def test_query_and_explain_requires_explicit_bounded_match_index() -> None:
    http = client()
    for payload in (
        {"label_text": "Fictional Unicode ข้อมูล"},
        {"label_text": "Fictional Unicode ข้อมูล", "match_index": -1},
        {"label_text": "Fictional Unicode ข้อมูล", "match_index": 10_001},
        {"label_text": "Fictional Unicode ข้อมูล", "match_index": True},
    ):
        response = http.post("/v1/query-and-explain", json=payload)
        assert response.status_code == 422

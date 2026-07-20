from cpmoakb.application import QueryAndExplainRequest, QueryRecordsRequest

from ._support import invoke, runtime_service


def test_query_and_explain_equals_direct_application_canonical_output() -> None:
    service = runtime_service()
    request = QueryAndExplainRequest(
        QueryRecordsRequest.from_values(label_text="Fictional Unicode ข้อมูล"), 0
    )
    direct = service.query_explain_and_project(request).canonical_json
    argv = (
        "query-and-explain",
        "--label-text",
        "Fictional Unicode ข้อมูล",
        "--match-index",
        "0",
    )
    first = invoke(argv, service)
    second = invoke(argv, service)
    assert first == second == (0, direct + "\n", "")
    text = first[1].casefold()
    assert "rank" not in text
    assert "recommend" not in text
    assert "diagnosis" not in text


def test_match_index_is_explicit_and_bounded() -> None:
    invalid = (
        ("query-and-explain",),
        ("query-and-explain", "--match-index", "-1"),
        ("query-and-explain", "--match-index", "10001"),
        ("query-and-explain", "--match-index", "not-an-integer"),
    )
    for argv in invalid:
        exit_code, stdout, stderr = invoke(argv)
        assert exit_code == 2
        assert stdout == ""
        assert '"code":"cli-argument-error"' in stderr


def test_match_outside_actual_result_is_application_contract_error() -> None:
    result = invoke(
        (
            "query-and-explain",
            "--label-text",
            "No fictional match",
            "--match-index",
            "0",
        )
    )
    assert result == (
        3,
        "",
        '{"error":{"code":"application-contract-error","message":'
        '"The request violates the application contract."}}\n',
    )

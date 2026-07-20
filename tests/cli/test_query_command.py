import json

from cpmoakb.application import QueryRecordsRequest

from ._support import invoke, runtime_service


def test_query_output_equals_direct_application_canonical_projection() -> None:
    service = runtime_service()
    direct = service.query_and_project(
        QueryRecordsRequest.from_values(label_text="Fictional Unicode ข้อมูล")
    ).canonical_json
    argv = ("query", "--label-text", "Fictional Unicode ข้อมูล")
    first = invoke(argv, service)
    second = invoke(argv, service)
    assert first == second == (0, direct + "\n", "")
    assert "Fictional Unicode ข้อมูล" in first[1]
    assert first[1].count("\n") == 1


def test_empty_query_is_successful() -> None:
    exit_code, stdout, stderr = invoke(("query", "--label-text", "No fictional match"))
    assert exit_code == 0
    assert stderr == ""
    projected = json.loads(stdout)
    assert projected["data"]["total_count"] == 0
    assert projected["data"]["matches"] == []


def test_query_accepts_only_the_explicit_bounded_criteria_subset() -> None:
    exit_code, stdout, stderr = invoke(
        (
            "query",
            "--domain-type",
            "SyntheticConcept",
            "--label-scope",
            "preferred",
            "--language",
            "en",
            "--locale",
            "en-US",
            "--match-mode",
            "conservative_normalized",
            "--predicate",
            "fictional_link",
        )
    )
    assert exit_code == 0
    assert stdout
    assert stderr == ""


def test_unknown_invalid_and_over_limit_query_arguments_are_stable_errors() -> None:
    invalid = (
        ("query", "--unknown", "value"),
        ("query", "--label-scope", "all"),
        ("query", "--match-mode", "fuzzy"),
        ("query", "--label-text", " "),
        ("query", "--label-text", "x" * 257),
        ("query", "--label-text"),
        (),
    )
    expected = (
        2,
        "",
        '{"error":{"code":"cli-argument-error","message":'
        '"The command-line arguments violate the CLI contract."}}\n',
    )
    for argv in invalid:
        assert invoke(argv) == expected

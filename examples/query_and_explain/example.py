"""Compose and execute one query-and-explain application operation."""

import json

from cpmoakb.application import QueryAndExplainRequest, QueryRecordsRequest
from cpmoakb.composition import create_runtime_application_service
from cpmoakb.explain import ExplanationService
from cpmoakb.query import QueryService

from examples._support import synthetic_record


def main() -> int:
    service = create_runtime_application_service(
        query_service=QueryService.from_records((synthetic_record(),)),
        explanation_service=ExplanationService(),
    )
    response = service.query_explain_and_project(
        QueryAndExplainRequest(
            QueryRecordsRequest.from_values(label_text="Fictional Widget"), 0
        )
    )
    value = json.loads(response.canonical_json)
    print(
        "operation=query-and-explain",
        f"matches={value['query']['data']['total_count']}",
        f"explanation={value['explanation']['data']['explanation_type']}",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

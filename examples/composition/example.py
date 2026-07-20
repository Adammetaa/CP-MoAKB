"""Construct a new facade solely from caller-owned services."""

from cpmoakb.application import (
    RUNTIME_APPLICATION_API_VERSION,
    QueryRecordsRequest,
)
from cpmoakb.composition import (
    RUNTIME_COMPOSITION_API_VERSION,
    create_runtime_application_service,
)
from cpmoakb.explain import ExplanationService
from cpmoakb.query import QueryService


def main() -> int:
    service = create_runtime_application_service(
        query_service=QueryService.from_records(()),
        explanation_service=ExplanationService(),
    )
    result = service.query_records(QueryRecordsRequest.from_values())
    print(
        f"composition={RUNTIME_COMPOSITION_API_VERSION}",
        f"application={RUNTIME_APPLICATION_API_VERSION}",
        f"matches={result.query_result.total_count}",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

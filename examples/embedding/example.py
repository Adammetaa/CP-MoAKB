"""Embed the application facade in ordinary caller code."""

from cpmoakb.application import QueryRecordsRequest
from cpmoakb.composition import create_runtime_application_service
from cpmoakb.explain import ExplanationService
from cpmoakb.query import QueryService

from examples._support import synthetic_record


def main() -> int:
    records = (synthetic_record(),)
    service = create_runtime_application_service(
        query_service=QueryService.from_records(records),
        explanation_service=ExplanationService(),
    )
    result = service.query_records(
        QueryRecordsRequest.from_values(domain_type="SyntheticConcept")
    )
    print(f"embedded_records={len(records)} matches={result.query_result.total_count}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

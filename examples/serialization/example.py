"""Project a deterministic query result to canonical JSON."""

from cpmoakb.query import QueryCriteria, QueryService
from cpmoakb.serialization import project_query_result, to_canonical_json

from examples._support import synthetic_record


def main() -> int:
    result = QueryService.from_records((synthetic_record(),)).search(
        QueryCriteria(label_text="Fictional Widget")
    )
    projection = project_query_result(result)
    print(to_canonical_json(projection))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

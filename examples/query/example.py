"""Query one explicit fictional record deterministically."""

from cpmoakb.query import QueryCriteria, QueryService

from examples._support import synthetic_record


def main() -> int:
    result = QueryService.from_records((synthetic_record(),)).search(
        QueryCriteria(label_text="Fictional Widget")
    )
    print(f"matches={result.total_count}")
    for match in result.matches:
        print(match.record.identifier, match.matched_field, match.matched_value)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

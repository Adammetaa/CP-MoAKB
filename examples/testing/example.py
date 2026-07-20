"""Demonstrate a deterministic assertion over public APIs."""

from cpmoakb.query import QueryCriteria, QueryService
from cpmoakb.serialization import to_canonical_json

from examples._support import synthetic_record


def main() -> int:
    service = QueryService.from_records((synthetic_record(),))
    criteria = QueryCriteria(label_text="Fictional Widget")
    first = to_canonical_json(service.search(criteria))
    second = to_canonical_json(service.search(criteria))
    assert first == second
    print("deterministic=true matches=1")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

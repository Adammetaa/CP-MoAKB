"""Load and inspect one fictional candidate through public APIs."""

from examples._support import synthetic_record


def main() -> int:
    record = synthetic_record()
    print(record.identifier, record.labels.preferred[0].text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

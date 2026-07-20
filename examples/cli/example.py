"""Invoke the reference CLI entirely as an injected library."""

from io import StringIO

from cpmoakb.cli import run_cli
from cpmoakb.composition import create_runtime_application_service
from cpmoakb.explain import ExplanationService
from cpmoakb.query import QueryService


def main() -> int:
    service = create_runtime_application_service(
        query_service=QueryService.from_records(()),
        explanation_service=ExplanationService(),
    )
    stdout = StringIO()
    stderr = StringIO()
    exit_code = run_cli(("version",), service, stdout, stderr)
    print(stdout.getvalue(), end="")
    print(f"exit={exit_code}")
    if stderr.getvalue():
        raise RuntimeError("successful CLI example wrote stderr")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

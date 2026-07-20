from __future__ import annotations

from io import StringIO
from typing import Sequence

from cpmoakb.application import RuntimeApplicationService
from cpmoakb.cli import run_cli
from cpmoakb.explain import ExplanationService
from cpmoakb.query import QueryService
from tests.query._support import entity


def runtime_service() -> RuntimeApplicationService:
    return RuntimeApplicationService(
        QueryService.from_records(
            (
                entity(993002, preferred_text="Fictional Beta"),
                entity(993001, preferred_text="Fictional Unicode ข้อมูล"),
            )
        ),
        ExplanationService(),
    )


def invoke(
    argv: Sequence[str], service: RuntimeApplicationService | None = None
) -> tuple[int, str, str]:
    stdout = StringIO()
    stderr = StringIO()
    exit_code = run_cli(argv, service or runtime_service(), stdout, stderr)
    return exit_code, stdout.getvalue(), stderr.getvalue()

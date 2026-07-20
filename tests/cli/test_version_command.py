import importlib
import json
from io import StringIO

import pytest

import cpmoakb.cli
from cpmoakb.cli import run_cli

from ._support import invoke, runtime_service


def test_version_output_is_exact_stable_and_environment_free() -> None:
    expected = (
        '{"application_api_version":"0.1","cli_api_version":"0.1",'
        '"http_api_version":"0.1","projection_version":"1.0",'
        '"runtime_api_version":"0.1"}\n'
    )
    first = invoke(("version",))
    second = invoke(("version",))
    assert first == second == (0, expected, "")
    assert json.loads(first[1])["cli_api_version"] == "0.1"
    for prohibited in ("timestamp", "hostname", "platform", "path", "pid", "git"):
        assert prohibited not in first[1].casefold()


def test_dependencies_and_streams_are_explicitly_required() -> None:
    stdout = StringIO()
    stderr = StringIO()
    with pytest.raises(TypeError):
        run_cli(("version",), None, stdout, stderr)  # type: ignore[arg-type]
    with pytest.raises(TypeError):
        run_cli("version", runtime_service(), stdout, stderr)  # type: ignore[arg-type]
    with pytest.raises(TypeError):
        run_cli(("version",), runtime_service(), None, stderr)  # type: ignore[arg-type]
    with pytest.raises(TypeError):
        run_cli(("version",), runtime_service(), stdout, None)  # type: ignore[arg-type]


def test_import_is_library_only_and_executes_no_command() -> None:
    module = importlib.reload(cpmoakb.cli)
    assert not hasattr(module, "main") or not callable(getattr(module, "main"))
    assert not hasattr(module, "service")


def test_independent_calls_share_no_stream_or_command_state() -> None:
    first = invoke(("version",), runtime_service())
    second = invoke(("version",), runtime_service())
    assert first == second

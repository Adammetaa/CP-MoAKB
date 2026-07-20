"""Library-first reference CLI over the Runtime application facade."""

from __future__ import annotations

import argparse
from collections.abc import Sequence
from typing import TextIO

from cpmoakb.application import (
    RUNTIME_APPLICATION_API_VERSION,
    QueryAndExplainRequest,
    QueryRecordsRequest,
    RuntimeApplicationService,
    classify_application_error,
)
from cpmoakb.http_api import RUNTIME_HTTP_API_VERSION
from cpmoakb.runtime_api import RUNTIME_API_VERSION
from cpmoakb.serialization import RUNTIME_JSON_PROJECTION_VERSION

from .errors import CliArgumentError
from .output import canonical_static_json, write_error, write_success
from .parser import build_parser

RUNTIME_CLI_API_VERSION = "0.1"


def run_cli(
    argv: Sequence[str],
    runtime_application_service: RuntimeApplicationService,
    stdout: TextIO,
    stderr: TextIO,
) -> int:
    """Execute one deterministic CLI command with explicit dependencies."""

    _validate_injection(argv, runtime_application_service, stdout, stderr)
    try:
        arguments = build_parser().parse_args(tuple(argv))
        if arguments.command == "version":
            return write_success(stdout, _version_json())
        request = _query_request(arguments)
        if arguments.command == "query":
            response = runtime_application_service.query_and_project(request)
        elif arguments.command == "query-and-explain":
            combined = QueryAndExplainRequest(request, arguments.match_index)
            response = runtime_application_service.query_explain_and_project(combined)
        else:
            raise CliArgumentError("unsupported CLI command")
        return write_success(stdout, response.canonical_json)
    except CliArgumentError:
        return write_error(stderr, "cli-argument-error")
    except Exception as error:
        return write_error(stderr, classify_application_error(error))


def _validate_injection(
    argv: Sequence[str],
    service: RuntimeApplicationService,
    stdout: TextIO,
    stderr: TextIO,
) -> None:
    if isinstance(argv, (str, bytes)) or not isinstance(argv, Sequence):
        raise TypeError("argv must be a sequence of strings")
    if not all(isinstance(value, str) for value in argv):
        raise TypeError("argv must contain only strings")
    if not isinstance(service, RuntimeApplicationService):
        raise TypeError("service must be RuntimeApplicationService")
    if not callable(getattr(stdout, "write", None)):
        raise TypeError("stdout must be a text stream")
    if not callable(getattr(stderr, "write", None)):
        raise TypeError("stderr must be a text stream")


def _query_request(arguments: argparse.Namespace) -> QueryRecordsRequest:
    return QueryRecordsRequest.from_values(
        domain_type=arguments.domain_type,
        label_text=arguments.label_text,
        label_scope=arguments.label_scope,
        language=arguments.language,
        locale=arguments.locale,
        match_mode=arguments.match_mode,
        predicate=arguments.predicate,
    )


def _version_json() -> str:
    return canonical_static_json(
        {
            "cli_api_version": RUNTIME_CLI_API_VERSION,
            "application_api_version": RUNTIME_APPLICATION_API_VERSION,
            "runtime_api_version": RUNTIME_API_VERSION,
            "projection_version": RUNTIME_JSON_PROJECTION_VERSION,
            "http_api_version": RUNTIME_HTTP_API_VERSION,
        }
    )

"""Deterministic stdout/stderr documents and exit-code mapping."""

from __future__ import annotations

import json
from typing import TextIO

_ERRORS: dict[str, tuple[int, str]] = {
    "cli-argument-error": (
        2,
        "The command-line arguments violate the CLI contract.",
    ),
    "application-contract-error": (
        3,
        "The request violates the application contract.",
    ),
    "unsupported-application-request": (
        4,
        "The application request type is unsupported.",
    ),
    "application-dependency-error": (5, "An application dependency failed."),
    "runtime-query-error": (6, "The Runtime query operation failed."),
    "runtime-explanation-error": (
        6,
        "The Runtime explanation operation failed.",
    ),
    "runtime-serialization-error": (
        6,
        "The Runtime projection operation failed.",
    ),
    "internal-error": (70, "An internal CLI error occurred."),
}


StaticDocument = dict[str, str] | dict[str, dict[str, str]]


def canonical_static_json(value: StaticDocument) -> str:
    return json.dumps(
        value,
        ensure_ascii=False,
        allow_nan=False,
        sort_keys=True,
        separators=(",", ":"),
    )


def write_success(stdout: TextIO, canonical_json: str) -> int:
    stdout.write(canonical_json)
    stdout.write("\n")
    return 0


def write_error(stderr: TextIO, code: str) -> int:
    exit_code, message = _ERRORS.get(code, _ERRORS["internal-error"])
    stderr.write(canonical_static_json({"error": {"code": code, "message": message}}))
    stderr.write("\n")
    return exit_code

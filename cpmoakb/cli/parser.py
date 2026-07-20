"""Closed argparse contract for the reference CLI consumer."""

from __future__ import annotations

import argparse
from typing import Never

from .errors import CliArgumentError

_MAX_TEXT_LENGTH = 256
_MAX_TAG_LENGTH = 64
_MAX_MATCH_INDEX = 10_000


class _DeterministicArgumentParser(argparse.ArgumentParser):
    def error(self, message: str) -> Never:
        del message
        raise CliArgumentError("command-line arguments violate the CLI contract")


def build_parser() -> argparse.ArgumentParser:
    parser = _DeterministicArgumentParser(prog="cpmoakb", add_help=False)
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("version", add_help=False)

    query = commands.add_parser("query", add_help=False)
    _add_query_arguments(query)

    query_and_explain = commands.add_parser("query-and-explain", add_help=False)
    _add_query_arguments(query_and_explain)
    query_and_explain.add_argument(
        "--match-index", required=True, type=_bounded_match_index
    )
    return parser


def _add_query_arguments(parser: argparse.ArgumentParser) -> None:
    parser.add_argument("--domain-type", type=_bounded_text)
    parser.add_argument("--label-text", type=_bounded_text)
    parser.add_argument(
        "--label-scope",
        choices=("any", "preferred", "alternative"),
        default="any",
    )
    parser.add_argument("--language", type=_bounded_tag)
    parser.add_argument("--locale", type=_bounded_tag)
    parser.add_argument(
        "--match-mode",
        choices=("exact", "case_insensitive", "conservative_normalized"),
        default="exact",
    )
    parser.add_argument("--predicate", type=_bounded_text)


def _bounded_text(value: str) -> str:
    if not value or len(value) > _MAX_TEXT_LENGTH or not value.strip(" \t\r\n\f\v"):
        raise argparse.ArgumentTypeError("text is outside the CLI contract")
    return value


def _bounded_tag(value: str) -> str:
    if not value or len(value) > _MAX_TAG_LENGTH:
        raise argparse.ArgumentTypeError("tag is outside the CLI contract")
    return value


def _bounded_match_index(value: str) -> int:
    try:
        parsed = int(value)
    except ValueError as error:
        raise argparse.ArgumentTypeError(
            "match index is outside the CLI contract"
        ) from error
    if parsed < 0 or parsed > _MAX_MATCH_INDEX:
        raise argparse.ArgumentTypeError("match index is outside the CLI contract")
    return parsed

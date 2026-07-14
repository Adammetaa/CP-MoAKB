"""Public text and byte parsing functions for constrained candidate YAML."""

from __future__ import annotations

from collections.abc import Mapping

from .errors import YamlSyntaxError
from .restrictions import compose_constrained_yaml


def parse_candidate_yaml(text: str) -> Mapping[str, object]:
    """Parse one constrained YAML document without mapping it to the domain."""

    if not isinstance(text, str):
        raise TypeError("text must be str")
    return compose_constrained_yaml(text)


def parse_candidate_yaml_bytes(data: bytes) -> Mapping[str, object]:
    """Decode strict UTF-8 bytes and parse one constrained YAML document."""

    if not isinstance(data, bytes):
        raise TypeError("data must be bytes")
    try:
        text = data.decode("utf-8", errors="strict")
    except UnicodeDecodeError as error:
        raise YamlSyntaxError(
            "input is not valid UTF-8",
            path="$",
            remediation_hint="encode the document as UTF-8 without malformed byte sequences",
        ) from error
    return parse_candidate_yaml(text)

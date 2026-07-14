from pathlib import Path

import pytest
from yaml.nodes import Node

from cpmoakb.adapters.yaml import (
    YamlSyntaxError,
    parse_candidate_yaml,
    parse_candidate_yaml_bytes,
)

FIXTURES = Path(__file__).parent / "fixtures"


def test_parser_returns_only_builtin_constrained_values():
    parsed = parse_candidate_yaml(
        (FIXTURES / "valid" / "minimal_entity.yaml").read_text(encoding="utf-8")
    )

    assert isinstance(parsed, dict)
    assert isinstance(parsed["labels"], list)
    assert not any(isinstance(value, Node) for value in parsed.values())


def test_malformed_yaml_is_translated_with_cause():
    with pytest.raises(YamlSyntaxError) as captured:
        parse_candidate_yaml(
            (FIXTURES / "invalid" / "malformed.yaml").read_text(encoding="utf-8")
        )

    assert captured.value.__cause__ is not None
    assert captured.value.line is not None


def test_bytes_parser_requires_valid_utf8():
    with pytest.raises(YamlSyntaxError, match="valid UTF-8") as captured:
        parse_candidate_yaml_bytes(b"\xff\xfe")

    assert isinstance(captured.value.__cause__, UnicodeDecodeError)


def test_parser_is_deterministic():
    text = (FIXTURES / "valid" / "multilingual_entity.yaml").read_text(encoding="utf-8")
    assert parse_candidate_yaml(text) == parse_candidate_yaml(text)

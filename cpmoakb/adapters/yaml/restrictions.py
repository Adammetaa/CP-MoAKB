"""Low-level YAML feature inspection and constrained node conversion."""

from __future__ import annotations

import math
from collections.abc import Mapping
from typing import cast

import yaml
from yaml.events import AliasEvent, DocumentStartEvent, NodeEvent
from yaml.nodes import MappingNode, Node, ScalarNode, SequenceNode

from .errors import UnsupportedYamlFeatureError, YamlRestrictionError, YamlSyntaxError

_TAG_PREFIX = "tag:yaml.org,2002:"
_STRING_TAG = f"{_TAG_PREFIX}str"
_BOOL_TAG = f"{_TAG_PREFIX}bool"
_INT_TAG = f"{_TAG_PREFIX}int"
_FLOAT_TAG = f"{_TAG_PREFIX}float"
_MAP_TAG = f"{_TAG_PREFIX}map"
_SEQ_TAG = f"{_TAG_PREFIX}seq"
_ALLOWED_TAGS = {_STRING_TAG, _BOOL_TAG, _INT_TAG, _FLOAT_TAG, _MAP_TAG, _SEQ_TAG}


def _mark(error: yaml.YAMLError) -> tuple[int | None, int | None]:
    mark = getattr(error, "problem_mark", None)
    if mark is None:
        return None, None
    return mark.line + 1, mark.column + 1


def _scan_events(text: str) -> None:
    try:
        events = list(yaml.parse(text, Loader=yaml.SafeLoader))
    except yaml.YAMLError as error:
        line, column = _mark(error)
        raise YamlSyntaxError(
            getattr(error, "problem", None) or "malformed YAML",
            line=line,
            column=column,
        ) from error

    document_count = sum(isinstance(event, DocumentStartEvent) for event in events)
    if document_count != 1:
        raise UnsupportedYamlFeatureError("exactly one YAML document is required")

    alias = next((event for event in events if isinstance(event, AliasEvent)), None)
    if alias is not None:
        raise UnsupportedYamlFeatureError(
            "aliases are prohibited",
            line=alias.start_mark.line + 1,
            column=alias.start_mark.column + 1,
        )

    for event in events:
        if isinstance(event, NodeEvent) and event.anchor is not None:
            raise UnsupportedYamlFeatureError(
                "anchors are prohibited",
                line=event.start_mark.line + 1,
                column=event.start_mark.column + 1,
            )
        tag = cast(str | None, getattr(event, "tag", None))
        if isinstance(event, NodeEvent) and tag not in (None, "!"):
            if tag not in _ALLOWED_TAGS:
                raise UnsupportedYamlFeatureError(
                    f"custom or unsupported tag {tag!r} is prohibited",
                    line=event.start_mark.line + 1,
                    column=event.start_mark.column + 1,
                )


def _scalar(node: ScalarNode, path: str) -> object:
    if node.tag == _STRING_TAG:
        return node.value
    if node.tag == _BOOL_TAG:
        if node.value not in {"true", "false"}:
            raise YamlRestrictionError(
                "booleans must use lowercase true or false", path=path
            )
        return node.value == "true"
    if node.tag in {_INT_TAG, _FLOAT_TAG}:
        value = yaml.safe_load(node.value)
        if not isinstance(value, (int, float)) or isinstance(value, bool):
            raise YamlRestrictionError("unsupported numeric scalar", path=path)
        if isinstance(value, float) and not math.isfinite(value):
            raise YamlRestrictionError(
                "non-finite numeric scalars are prohibited", path=path
            )
        return value
    raise UnsupportedYamlFeatureError(
        f"scalar type {node.tag!r} is prohibited",
        path=path,
        line=node.start_mark.line + 1,
        column=node.start_mark.column + 1,
    )


def _convert(node: Node, path: str) -> object:
    if node.tag not in _ALLOWED_TAGS:
        raise UnsupportedYamlFeatureError(
            f"YAML type {node.tag!r} is prohibited",
            path=path,
            line=node.start_mark.line + 1,
            column=node.start_mark.column + 1,
        )
    if isinstance(node, ScalarNode):
        return _scalar(node, path)
    if isinstance(node, SequenceNode):
        return [
            _convert(item, f"{path}[{index}]") for index, item in enumerate(node.value)
        ]
    if not isinstance(node, MappingNode):
        raise UnsupportedYamlFeatureError("unsupported YAML node", path=path)

    result: dict[str, object] = {}
    for key_node, value_node in node.value:
        if not isinstance(key_node, ScalarNode):
            raise UnsupportedYamlFeatureError(
                "complex mapping keys are prohibited",
                path=path,
                line=key_node.start_mark.line + 1,
                column=key_node.start_mark.column + 1,
            )
        if key_node.value == "<<":
            raise UnsupportedYamlFeatureError(
                "merge keys are prohibited", path=f"{path}.<<"
            )
        if key_node.tag != _STRING_TAG:
            raise UnsupportedYamlFeatureError(
                "mapping keys must be strings",
                path=path,
                line=key_node.start_mark.line + 1,
                column=key_node.start_mark.column + 1,
            )
        key = key_node.value
        key_path = f"{path}.{key}"
        if key in result:
            raise YamlRestrictionError(
                f"duplicate mapping key {key!r}",
                path=key_path,
                line=key_node.start_mark.line + 1,
                column=key_node.start_mark.column + 1,
            )
        result[key] = _convert(value_node, key_path)
    return result


def compose_constrained_yaml(text: str) -> Mapping[str, object]:
    """Return one safe built-in mapping after enforcing YAML restrictions."""

    _scan_events(text)
    try:
        documents = list(yaml.compose_all(text, Loader=yaml.SafeLoader))
    except yaml.YAMLError as error:
        line, column = _mark(error)
        raise YamlSyntaxError(
            getattr(error, "problem", None) or "malformed YAML",
            line=line,
            column=column,
        ) from error
    if len(documents) != 1 or documents[0] is None:
        raise UnsupportedYamlFeatureError(
            "exactly one non-empty YAML document is required"
        )
    if not isinstance(documents[0], MappingNode):
        raise YamlRestrictionError("top-level YAML value must be a mapping")
    return cast(Mapping[str, object], _convert(documents[0], "$"))

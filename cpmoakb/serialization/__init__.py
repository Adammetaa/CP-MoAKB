"""Versioned, deterministic, output-only Runtime JSON projections."""

from .errors import (
    ProjectionContractError,
    SerializationError,
    UnsupportedProjectionTypeError,
)
from .json_projection import (
    RUNTIME_JSON_PROJECTION_VERSION,
    project_query_result,
    project_registry_snapshot,
    project_runtime_value,
    project_structured_explanation,
    project_validation_result,
    to_canonical_json,
)
from .types import JsonScalar, JsonValue

__all__ = [
    "JsonScalar",
    "JsonValue",
    "ProjectionContractError",
    "RUNTIME_JSON_PROJECTION_VERSION",
    "SerializationError",
    "UnsupportedProjectionTypeError",
    "project_query_result",
    "project_registry_snapshot",
    "project_runtime_value",
    "project_structured_explanation",
    "project_validation_result",
    "to_canonical_json",
]

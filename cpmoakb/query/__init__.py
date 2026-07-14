"""Intentional public API for deterministic read-only query services."""

from .criteria import QueryCriteria
from .enums import LabelScope, TextMatchMode
from .errors import (
    DuplicateQueryRecordError,
    InvalidQueryCriteriaError,
    QueryError,
    QueryItemNotFoundError,
    UnsupportedQueryOperationError,
)
from .indexes import ReadOnlyQueryIndex
from .results import QueryMatch, QueryResult
from .services import QueryService, RegistrySnapshotQueryService

__all__ = [
    "DuplicateQueryRecordError",
    "InvalidQueryCriteriaError",
    "LabelScope",
    "QueryCriteria",
    "QueryError",
    "QueryItemNotFoundError",
    "QueryMatch",
    "QueryResult",
    "QueryService",
    "ReadOnlyQueryIndex",
    "RegistrySnapshotQueryService",
    "TextMatchMode",
    "UnsupportedQueryOperationError",
]

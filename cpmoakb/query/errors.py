"""Typed query configuration and lookup failures."""


class QueryError(RuntimeError):
    """Base class for query-layer errors."""


class InvalidQueryCriteriaError(QueryError):
    """Explicit criteria cannot be interpreted safely."""


class DuplicateQueryRecordError(QueryError):
    """An in-memory query index received duplicate record identifiers."""


class QueryItemNotFoundError(QueryError):
    """A required exact lookup did not find its typed key."""


class UnsupportedQueryOperationError(QueryError):
    """A query requires a snapshot or source that was not supplied."""

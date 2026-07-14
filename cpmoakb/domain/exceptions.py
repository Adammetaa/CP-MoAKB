"""Domain-specific failures raised by the generic runtime core."""


class DomainError(ValueError):
    """Base class for invalid domain values and operations."""


class InvalidIdentifierError(DomainError):
    """An identifier does not satisfy its value-object invariant."""


class InvalidLabelError(DomainError):
    """A multilingual label is structurally invalid."""


class DuplicatePreferredLabelError(InvalidLabelError):
    """More than one preferred label uses the same language and locale."""


class InvalidRecordError(DomainError):
    """A generic record violates its lifecycle or shape constraints."""


class InvalidRelationshipError(InvalidRecordError):
    """A relationship record violates relationship-specific constraints."""


class RepositoryError(RuntimeError):
    """Base class for storage-neutral repository operation failures."""


class RecordNotFoundError(RepositoryError):
    """A requested record does not exist."""


class DuplicateRecordError(RepositoryError):
    """A repository operation would duplicate an existing record."""

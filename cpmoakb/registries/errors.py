"""Typed failures for explicit governed registry operations."""


class RegistryError(RuntimeError):
    """Base class for deterministic registry operation failures."""


class RegistryConflictError(RegistryError):
    """An existing identity key has an incompatible payload."""


class IdentifierAlreadyReservedError(RegistryError):
    """A candidate identifier is already in reserved custody."""


class IdentifierNotReservedError(RegistryError):
    """Registration was requested before explicit reservation."""


class IdentifierStateTransitionError(RegistryError):
    """A candidate custody transition is not permitted."""


class RegistryItemNotFoundError(RegistryError):
    """A requested typed registry key is absent."""


class InvalidRegistryOperationError(RegistryError):
    """An operation or typed argument violates the registry contract."""

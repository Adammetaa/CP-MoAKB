"""Typed failures for the output-only Runtime JSON projection boundary."""


class SerializationError(RuntimeError):
    """Base error for deterministic Runtime output projection failures."""


class UnsupportedProjectionTypeError(SerializationError):
    """Raised when a value is not an explicitly supported projection target."""


class ProjectionContractError(SerializationError):
    """Raised when a projected value violates the JSON projection contract."""

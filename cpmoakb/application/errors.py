"""Typed failures for the transport-neutral Runtime application boundary."""


class ApplicationServiceError(RuntimeError):
    """Base error for Runtime application-service failures."""


class UnsupportedApplicationRequestError(ApplicationServiceError):
    """Raised when an operation receives an unsupported request object."""


class ApplicationContractError(ApplicationServiceError):
    """Raised when an explicit application request contract cannot be fulfilled."""


class ApplicationDependencyError(ApplicationServiceError):
    """Raised when an injected dependency violates its application contract."""

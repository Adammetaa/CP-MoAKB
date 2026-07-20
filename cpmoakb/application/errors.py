"""Typed failures for the transport-neutral Runtime application boundary."""

from cpmoakb.explain import ExplanationError
from cpmoakb.query import QueryError
from cpmoakb.serialization import SerializationError


class ApplicationServiceError(RuntimeError):
    """Base error for Runtime application-service failures."""


class UnsupportedApplicationRequestError(ApplicationServiceError):
    """Raised when an operation receives an unsupported request object."""


class ApplicationContractError(ApplicationServiceError):
    """Raised when an explicit application request contract cannot be fulfilled."""


class ApplicationDependencyError(ApplicationServiceError):
    """Raised when an injected dependency violates its application contract."""


def classify_application_error(error: Exception) -> str:
    """Classify known facade failures without exposing lower layers to transports."""

    if isinstance(error, UnsupportedApplicationRequestError):
        return "unsupported-application-request"
    if isinstance(error, ApplicationContractError):
        return "application-contract-error"
    if isinstance(error, ApplicationDependencyError):
        return "application-dependency-error"
    if isinstance(error, QueryError):
        return "runtime-query-error"
    if isinstance(error, ExplanationError):
        return "runtime-explanation-error"
    if isinstance(error, SerializationError):
        return "runtime-serialization-error"
    return "internal-error"

"""Explicit, stateless composition boundary for installed consumers."""

from cpmoakb.application import RuntimeApplicationService
from cpmoakb.explain import ExplanationService
from cpmoakb.query import QueryService

RUNTIME_COMPOSITION_API_VERSION = "0.1"


def create_runtime_application_service(
    *,
    query_service: QueryService,
    explanation_service: ExplanationService,
) -> RuntimeApplicationService:
    """Compose a facade solely from caller-supplied governed services."""

    return RuntimeApplicationService(
        query_service=query_service,
        explanation_service=explanation_service,
    )


__all__ = [
    "RUNTIME_COMPOSITION_API_VERSION",
    "create_runtime_application_service",
]

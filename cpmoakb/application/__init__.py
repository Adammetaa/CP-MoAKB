"""Transport-neutral Runtime application-service facade."""

from .errors import (
    ApplicationContractError,
    ApplicationDependencyError,
    ApplicationServiceError,
    UnsupportedApplicationRequestError,
    classify_application_error,
)
from .requests import ExplainQueryRequest, QueryAndExplainRequest, QueryRecordsRequest
from .responses import (
    ExplainQueryResponse,
    ProjectedApplicationResponse,
    QueryAndExplainResponse,
    QueryRecordsResponse,
)
from .services import RUNTIME_APPLICATION_API_VERSION, RuntimeApplicationService

__all__ = [
    "ApplicationContractError",
    "ApplicationDependencyError",
    "ApplicationServiceError",
    "ExplainQueryRequest",
    "ExplainQueryResponse",
    "ProjectedApplicationResponse",
    "QueryAndExplainRequest",
    "QueryAndExplainResponse",
    "QueryRecordsRequest",
    "QueryRecordsResponse",
    "RUNTIME_APPLICATION_API_VERSION",
    "RuntimeApplicationService",
    "UnsupportedApplicationRequestError",
    "classify_application_error",
]

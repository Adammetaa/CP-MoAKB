"""Intentional public API for deterministic structured explanations."""

from .builders import (
    build_query_match_explanation,
    build_record_evidence_explanation,
    build_record_status_explanation,
    build_unavailable_explanation,
    build_validation_issue_explanation,
)
from .enums import (
    ExplanationAvailability,
    ExplanationReferenceType,
    ExplanationType,
    UnavailableRequestType,
)
from .errors import (
    ExplanationError,
    ExplanationRenderingError,
    InvalidExplanationInputError,
    UnsupportedExplanationTargetError,
)
from .models import (
    Explanation,
    ExplanationFact,
    ExplanationLimitation,
    ExplanationReference,
)
from .renderers import render_explanation
from .services import ExplanationService

__all__ = [
    "Explanation",
    "ExplanationAvailability",
    "ExplanationError",
    "ExplanationFact",
    "ExplanationLimitation",
    "ExplanationReference",
    "ExplanationReferenceType",
    "ExplanationRenderingError",
    "ExplanationService",
    "ExplanationType",
    "InvalidExplanationInputError",
    "UnavailableRequestType",
    "UnsupportedExplanationTargetError",
    "build_query_match_explanation",
    "build_record_evidence_explanation",
    "build_record_status_explanation",
    "build_unavailable_explanation",
    "build_validation_issue_explanation",
    "render_explanation",
]

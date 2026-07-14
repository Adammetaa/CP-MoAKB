"""Controlled values shared by the generic runtime domain."""

from enum import Enum


class RecordLifecycle(str, Enum):
    """Governance lifecycle, not a statement of scientific truth or fitness.

    ``ACCEPTED`` means repository governance accepted a record. ``PUBLISHED``
    does not mean universally true, regulator-approved, diagnostically
    sufficient, or suitable for a recommendation.
    """

    CANDIDATE = "candidate"
    UNDER_REVIEW = "under_review"
    ACCEPTED = "accepted"
    PUBLISHED = "published"
    DEPRECATED = "deprecated"
    SUPERSEDED = "superseded"
    REJECTED = "rejected"


class RecordKind(str, Enum):
    ENTITY = "entity"
    RELATIONSHIP = "relationship"


class ValidationSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"


class EvidenceRole(str, Enum):
    """How evidence participates in a claim-scoped review."""

    PRIMARY = "primary"
    CORROBORATING = "corroborating"
    CONTEXTUAL = "contextual"
    CONFLICTING = "conflicting"


class LabelStatus(str, Enum):
    """Provenance/review class of a label, separate from its language."""

    SOURCED = "sourced"
    EDITORIAL = "editorial"
    PROVISIONAL = "provisional"
    TRANSLITERATED = "transliterated"
    UNRESOLVED = "unresolved"

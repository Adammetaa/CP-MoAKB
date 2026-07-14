"""Controlled values for structured explanations."""

from enum import Enum


class ExplanationType(str, Enum):
    QUERY_MATCH = "query_match"
    VALIDATION_ISSUE = "validation_issue"
    RECORD_EVIDENCE = "record_evidence"
    RECORD_STATUS = "record_status"
    UNAVAILABLE = "unavailable"


class ExplanationAvailability(str, Enum):
    AVAILABLE = "available"
    PARTIAL = "partial"
    UNAVAILABLE = "unavailable"


class ExplanationReferenceType(str, Enum):
    RECORD = "record"
    VALIDATION_RULE = "validation_rule"
    SOURCE = "source"
    EVIDENCE = "evidence"
    QUERY_FIELD = "query_field"
    EXTERNAL_IDENTIFIER = "external_identifier"
    CUSTODY = "custody"


class UnavailableRequestType(str, Enum):
    MISSING_INFORMATION = "missing_information"
    SCIENTIFIC = "scientific"
    DIAGNOSIS = "diagnosis"
    RECOMMENDATION = "recommendation"
    CAUSAL = "causal"

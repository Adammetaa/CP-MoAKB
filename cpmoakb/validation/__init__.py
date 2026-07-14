"""Read-only validation for parsed CP-MoAKB source documents."""

from .irac_validator import (
    ValidationFinding,
    validate_irac_document,
    validate_irac_v11_5,
)
from cpmoakb.validation.context import ValidationContext
from cpmoakb.validation.engine import validate_record, validate_records
from cpmoakb.validation.enums import RuleApplicability, ValidationLayer
from cpmoakb.validation.errors import (
    DuplicateRuleIdentifierError,
    InvalidValidationContextError,
    InvalidValidationProfileError,
    UnsupportedValidationTargetError,
    ValidationFrameworkError,
)
from cpmoakb.validation.profiles import (
    GENERIC_BATCH_PROFILE,
    GENERIC_CANDIDATE_PROFILE,
    ValidationProfile,
)
from cpmoakb.validation.rules import RuleMetadata, ValidationRule

__all__ = [
    "DuplicateRuleIdentifierError",
    "GENERIC_BATCH_PROFILE",
    "GENERIC_CANDIDATE_PROFILE",
    "InvalidValidationContextError",
    "InvalidValidationProfileError",
    "RuleApplicability",
    "RuleMetadata",
    "UnsupportedValidationTargetError",
    "ValidationContext",
    "ValidationFinding",
    "ValidationFrameworkError",
    "ValidationLayer",
    "ValidationProfile",
    "ValidationRule",
    "validate_record",
    "validate_records",
    "validate_irac_document",
    "validate_irac_v11_5",
]

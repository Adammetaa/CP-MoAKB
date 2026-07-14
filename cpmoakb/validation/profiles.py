"""Deterministic validation profiles for candidate records."""

from __future__ import annotations

from dataclasses import dataclass

from cpmoakb.validation.builtins import (
    CROSS_OBJECT_RULES,
    DOMAIN_RULES,
    STRUCTURAL_RULES,
)
from cpmoakb.validation.enums import ValidationLayer
from cpmoakb.validation.errors import (
    DuplicateRuleIdentifierError,
    InvalidValidationProfileError,
)
from cpmoakb.validation.rules import ValidationRule


@dataclass(frozen=True, slots=True)
class ValidationProfile:
    """An ordered, versioned collection of validation rules."""

    profile_id: str
    name: str
    version: str
    rules: tuple[ValidationRule, ...]
    description: str = ""

    def __post_init__(self) -> None:
        for field_name in ("profile_id", "name", "version"):
            value = getattr(self, field_name)
            if not value or value != value.strip():
                raise InvalidValidationProfileError(
                    f"{field_name} must be a non-empty, trimmed string"
                )

        rule_ids = tuple(rule.metadata.identifier for rule in self.rules)
        if len(rule_ids) != len(set(rule_ids)):
            raise DuplicateRuleIdentifierError(
                f"profile {self.profile_id!r} contains duplicate rule identifiers"
            )

        deferred_layers = {ValidationLayer.REPRESENTATION, ValidationLayer.SCIENTIFIC}
        unsupported = tuple(
            rule.metadata.identifier
            for rule in self.rules
            if rule.metadata.layer in deferred_layers
        )
        if unsupported:
            raise InvalidValidationProfileError(
                "runtime profiles cannot contain deferred representation or scientific "
                f"rules: {', '.join(unsupported)}"
            )

    @property
    def rule_ids(self) -> tuple[str, ...]:
        """Return rule identifiers in declared execution order."""

        return tuple(rule.metadata.identifier for rule in self.rules)


GENERIC_CANDIDATE_PROFILE = ValidationProfile(
    profile_id="generic-candidate",
    name="Generic candidate validation",
    version="1.0.0",
    description="Generic structural and domain validation for one candidate record.",
    rules=STRUCTURAL_RULES + DOMAIN_RULES,
)

GENERIC_BATCH_PROFILE = ValidationProfile(
    profile_id="generic-batch",
    name="Generic candidate batch validation",
    version="1.0.0",
    description="Generic structural, domain, and cross-object candidate validation.",
    rules=STRUCTURAL_RULES + DOMAIN_RULES + CROSS_OBJECT_RULES,
)

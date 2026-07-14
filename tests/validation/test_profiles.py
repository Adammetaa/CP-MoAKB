from dataclasses import dataclass

import pytest

from cpmoakb.domain import ValidationIssue, ValidationSeverity
from cpmoakb.validation import (
    DuplicateRuleIdentifierError,
    GENERIC_BATCH_PROFILE,
    GENERIC_CANDIDATE_PROFILE,
    InvalidValidationProfileError,
    RuleApplicability,
    RuleMetadata,
    ValidationContext,
    ValidationLayer,
    ValidationProfile,
)
from cpmoakb.validation.rules import ValidationTarget


@dataclass(frozen=True)
class SyntheticRule:
    metadata: RuleMetadata

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        return ()


def metadata(
    identifier: str, layer: ValidationLayer = ValidationLayer.STRUCTURAL
) -> RuleMetadata:
    return RuleMetadata(
        identifier,
        "Synthetic rule",
        layer,
        "Synthetic rule used only for profile tests.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.RECORD,
    )


def test_profile_rejects_duplicate_rule_identifiers() -> None:
    rule = SyntheticRule(metadata("CPM-VAL-STR-900"))
    with pytest.raises(DuplicateRuleIdentifierError):
        ValidationProfile("synthetic", "Synthetic", "1.0", (rule, rule))


def test_profile_preserves_declared_order() -> None:
    rules = (
        SyntheticRule(metadata("CPM-VAL-STR-902")),
        SyntheticRule(metadata("CPM-VAL-STR-901")),
    )
    profile = ValidationProfile("synthetic", "Synthetic", "1.0", rules)
    assert profile.rule_ids == ("CPM-VAL-STR-902", "CPM-VAL-STR-901")


def test_deferred_layers_cannot_be_registered() -> None:
    rule = SyntheticRule(metadata("CPM-VAL-STR-903", ValidationLayer.SCIENTIFIC))
    with pytest.raises(InvalidValidationProfileError):
        ValidationProfile("synthetic", "Synthetic", "1.0", (rule,))


def test_generic_profiles_have_no_scientific_rules() -> None:
    for profile in (GENERIC_CANDIDATE_PROFILE, GENERIC_BATCH_PROFILE):
        assert all(
            rule.metadata.layer is not ValidationLayer.SCIENTIFIC
            for rule in profile.rules
        )

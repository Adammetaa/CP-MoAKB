from dataclasses import FrozenInstanceError

import pytest

from cpmoakb.domain import ValidationSeverity
from cpmoakb.validation import RuleApplicability, RuleMetadata, ValidationLayer
from cpmoakb.validation.builtins.structural import PreferredLabelRule
from cpmoakb.validation.errors import InvalidValidationProfileError


def test_validation_layer_enum_models_all_architecture_layers() -> None:
    assert [layer.value for layer in ValidationLayer] == [
        "representation",
        "structural",
        "domain",
        "cross_object",
        "scientific",
    ]


def test_rule_metadata_is_immutable_and_rule_is_traceable() -> None:
    metadata = PreferredLabelRule().metadata
    assert metadata.identifier == "CPM-VAL-STR-001"
    with pytest.raises(FrozenInstanceError):
        metadata.name = "Changed"  # type: ignore[misc]


def test_rule_identifier_is_validated() -> None:
    with pytest.raises(InvalidValidationProfileError):
        RuleMetadata(
            "mutable-description",
            "Synthetic rule",
            ValidationLayer.STRUCTURAL,
            "A synthetic invalid metadata example.",
            ValidationSeverity.ERROR,
            "1.0",
            RuleApplicability.RECORD,
        )

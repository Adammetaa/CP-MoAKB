from dataclasses import FrozenInstanceError, fields

import pytest

from cpmoakb.explain import (
    Explanation,
    ExplanationAvailability,
    ExplanationFact,
    ExplanationLimitation,
    ExplanationReference,
    ExplanationReferenceType,
    ExplanationType,
)


def test_models_are_immutable_and_order_all_components() -> None:
    later_ref = ExplanationReference(ExplanationReferenceType.SOURCE, "synthetic-b")
    earlier_ref = ExplanationReference(ExplanationReferenceType.RECORD, "synthetic-a")
    explanation = Explanation(
        ExplanationType.RECORD_EVIDENCE,
        ExplanationAvailability.AVAILABLE,
        earlier_ref,
        (
            ExplanationFact("z.field", "Z", "fact"),
            ExplanationFact("a.field", "A", "fact"),
        ),
        (later_ref, earlier_ref, later_ref),
        (
            ExplanationLimitation("Z_LIMIT", "Later limitation."),
            ExplanationLimitation("A_LIMIT", "Earlier limitation."),
        ),
    )
    assert tuple(fact.field_path for fact in explanation.facts) == (
        "a.field",
        "z.field",
    )
    assert explanation.supporting_references == (earlier_ref, later_ref)
    assert tuple(item.code for item in explanation.limitations) == (
        "A_LIMIT",
        "Z_LIMIT",
    )
    with pytest.raises(FrozenInstanceError):
        explanation.facts = ()  # type: ignore[misc]


def test_explanation_models_have_no_implicit_timestamp_fields() -> None:
    models = (Explanation, ExplanationFact, ExplanationReference, ExplanationLimitation)
    assert all(
        "timestamp" not in field.name and "created_at" not in field.name
        for model in models
        for field in fields(model)
    )

import pytest

from cpmoakb.explain import (
    ExplanationAvailability,
    ExplanationService,
    ExplanationType,
    UnavailableRequestType,
)


@pytest.mark.parametrize(
    ("request_type", "expected_code"),
    (
        (UnavailableRequestType.SCIENTIFIC, "SCIENTIFIC_EXPLANATION_UNAVAILABLE"),
        (UnavailableRequestType.DIAGNOSIS, "DIAGNOSIS_UNAVAILABLE"),
        (UnavailableRequestType.RECOMMENDATION, "RECOMMENDATION_UNAVAILABLE"),
        (UnavailableRequestType.CAUSAL, "CAUSAL_EXPLANATION_UNAVAILABLE"),
    ),
)
def test_out_of_scope_requests_return_structured_unavailable_explanations(
    request_type: UnavailableRequestType, expected_code: str
) -> None:
    explanation = ExplanationService().explain_unavailable(
        request_type, "Synthetic request lacks supported explicit facts"
    )
    assert explanation.explanation_type is ExplanationType.UNAVAILABLE
    assert explanation.availability is ExplanationAvailability.UNAVAILABLE
    assert explanation.facts == ()
    assert explanation.limitations[0].code == expected_code
    assert explanation.limitations[0].missing_input == (
        "Synthetic request lacks supported explicit facts"
    )


def test_missing_information_does_not_create_placeholder_facts() -> None:
    explanation = ExplanationService().explain_unavailable(
        UnavailableRequestType.MISSING_INFORMATION, "query match metadata"
    )
    assert explanation.facts == ()
    assert explanation.limitations[0].code == "MISSING_EXPLANATION_INPUT"

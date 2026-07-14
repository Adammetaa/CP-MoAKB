from cpmoakb.explain import (
    ExplanationAvailability,
    ExplanationService,
    UnavailableRequestType,
    render_explanation,
)
from cpmoakb.query import QueryCriteria, QueryService

from ._support import load_synthetic_record


def test_explanation_structure_ordering_and_rendering_contract() -> None:
    record = load_synthetic_record()
    criteria = QueryCriteria(label_text="Fictional Contract Widget")
    match = QueryService.from_records((record,)).search(criteria).matches[0]
    explanation = ExplanationService().explain_query_match(match, criteria)
    assert tuple(fact.sort_key for fact in explanation.facts) == tuple(
        sorted(fact.sort_key for fact in explanation.facts)
    )
    assert tuple(ref.sort_key for ref in explanation.supporting_references) == tuple(
        sorted(ref.sort_key for ref in explanation.supporting_references)
    )
    assert tuple(item.sort_key for item in explanation.limitations) == tuple(
        sorted(item.sort_key for item in explanation.limitations)
    )
    assert any(
        item.code == "LABEL_MATCH_NOT_IDENTITY" for item in explanation.limitations
    )
    rendered = render_explanation(explanation)
    assert render_explanation(explanation) == rendered
    for fact in explanation.facts:
        assert fact.value in rendered


def test_unavailable_requests_have_no_generated_facts() -> None:
    for request_type in (
        UnavailableRequestType.SCIENTIFIC,
        UnavailableRequestType.DIAGNOSIS,
        UnavailableRequestType.RECOMMENDATION,
    ):
        explanation = ExplanationService().explain_unavailable(request_type)
        assert explanation.availability is ExplanationAvailability.UNAVAILABLE
        assert explanation.facts == ()

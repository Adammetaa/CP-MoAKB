from cpmoakb.explain import ExplanationService, ExplanationType
from cpmoakb.query import QueryCriteria, QueryService, TextMatchMode

from ._support import record


def test_query_flow_preserves_exact_match_metadata() -> None:
    item = record()
    criteria = QueryCriteria(
        label_text="fictional explanation widget",
        match_mode=TextMatchMode.CASE_INSENSITIVE,
    )
    match = QueryService.from_records((item,)).search(criteria).matches[0]
    explanation = ExplanationService().explain_query_match(match, criteria)

    assert explanation.explanation_type is ExplanationType.QUERY_MATCH
    facts = {fact.field_path: fact.value for fact in explanation.facts}
    assert facts["record.identifier"] == str(item.identifier)
    assert facts["query.matched_field"] == "labels.preferred"
    assert facts["query.matched_value"] == "Fictional Explanation Widget"
    assert facts["query.match_mode"] == "case_insensitive"
    assert facts["query.language"] == "en"
    assert any(
        limitation.code == "LABEL_MATCH_NOT_IDENTITY"
        for limitation in explanation.limitations
    )


def test_query_explanation_does_not_mutate_match_or_criteria() -> None:
    criteria = QueryCriteria(label_text="Fictional Explanation Widget")
    match = QueryService.from_records((record(),)).search(criteria).matches[0]
    before = (repr(match), repr(criteria))
    ExplanationService().explain_query_match(match, criteria)
    assert (repr(match), repr(criteria)) == before

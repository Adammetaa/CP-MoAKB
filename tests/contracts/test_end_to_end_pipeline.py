from cpmoakb.explain import ExplanationService, render_explanation
from cpmoakb.query import QueryCriteria, QueryService
from cpmoakb.registries import (
    AuthorityRegistry,
    CandidateIdentifierRegistry,
    SourceRegistry,
)
from cpmoakb.validation import GENERIC_CANDIDATE_PROFILE, validate_record

from ._support import load_synthetic_record


def test_explicit_synthetic_end_to_end_success() -> None:
    record = load_synthetic_record()
    validation = validate_record(record, GENERIC_CANDIDATE_PROFILE)
    assert validation.is_valid

    identifiers = CandidateIdentifierRegistry()
    identifiers.reserve(record.identifier)
    identifiers.register(record.identifier)
    sources = SourceRegistry()
    sources.register(record.sources[0])
    authorities = AuthorityRegistry()
    authorities.register(record.authorities[0])

    criteria = QueryCriteria(label_text="Fictional Contract Widget")
    match = QueryService.from_records((record,)).search(criteria).matches[0]
    explanation = ExplanationService().explain_query_match(match, criteria)
    rendered = render_explanation(explanation)

    assert identifiers.snapshot().contains(record.identifier)
    assert sources.snapshot().contains(record.sources[0].identifier)
    assert authorities.snapshot().contains(record.authorities[0].identifier)
    assert str(record.identifier) in rendered


def test_layers_do_not_run_later_operations_automatically() -> None:
    record = load_synthetic_record()
    assert not hasattr(record, "validation_result")
    assert not hasattr(record, "registry_state")
    assert not hasattr(record, "query_result")
    assert not hasattr(record, "explanation")

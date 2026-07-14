from cpmoakb.explain import ExplanationService, render_explanation
from cpmoakb.query import QueryCriteria, QueryService
from cpmoakb.registries import CandidateIdentifierRegistry
from cpmoakb.validation import GENERIC_CANDIDATE_PROFILE, validate_record

from ._support import load_synthetic_record


def scenario_outputs() -> tuple[object, ...]:
    record = load_synthetic_record()
    validation = validate_record(record, GENERIC_CANDIDATE_PROFILE)
    registry = CandidateIdentifierRegistry()
    registry.reserve(record.identifier)
    registry.register(record.identifier)
    snapshot = registry.snapshot()
    criteria = QueryCriteria(label_text="Fictional Contract Widget")
    result = QueryService.from_records((record,)).search(criteria)
    explanation = ExplanationService().explain_query_match(result.matches[0], criteria)
    return validation, snapshot, result, explanation, render_explanation(explanation)


def test_equivalent_scenarios_are_equal_across_all_layers() -> None:
    assert scenario_outputs() == scenario_outputs() == scenario_outputs()

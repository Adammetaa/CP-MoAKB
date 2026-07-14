from cpmoakb.registries import CandidateIdentifierRegistry
from cpmoakb.validation import GENERIC_BATCH_PROFILE, validate_records

from ._support import entity


def test_registry_snapshot_and_validation_are_explicit_separate_operations() -> None:
    first = entity(991001)
    second = entity(991002)
    registry = CandidateIdentifierRegistry()
    for record in (second, first):
        registry.reserve(record.identifier)
        registry.register(record.identifier, record_id=record.identifier)

    before = registry.snapshot()
    result = validate_records((second, first), GENERIC_BATCH_PROFILE)
    after = registry.snapshot()

    assert result.is_valid
    assert before == after
    assert tuple(entry.identifier for entry in before.entries) == (
        first.identifier,
        second.identifier,
    )

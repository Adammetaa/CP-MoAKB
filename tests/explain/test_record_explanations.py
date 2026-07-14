from cpmoakb.domain import RecordLifecycle
from cpmoakb.explain import ExplanationAvailability, ExplanationService
from cpmoakb.registries import CandidateIdentifierRegistry

from ._support import candidate_id, record


def test_record_evidence_distinguishes_sources_evidence_and_provenance() -> None:
    explanation = ExplanationService().explain_record_evidence(
        record(with_evidence=True)
    )
    roles = {fact.role for fact in explanation.facts}
    assert "source_metadata_reference" in roles
    assert "evidence_locator" in roles
    assert "evidence_role" in roles
    assert "explicit_review_status" in roles
    assert "provenance_actor_role" in roles
    assert "provenance_review_role" in roles
    assert explanation.availability is ExplanationAvailability.AVAILABLE
    assert any(
        ref.reference_type.value == "source"
        for ref in explanation.supporting_references
    )
    assert any(
        ref.reference_type.value == "evidence"
        for ref in explanation.supporting_references
    )


def test_no_evidence_returns_partial_with_typed_limitation() -> None:
    explanation = ExplanationService().explain_record_evidence(record())
    assert explanation.availability is ExplanationAvailability.PARTIAL
    assert any(item.code == "NO_EVIDENCE_ATTACHED" for item in explanation.limitations)


def test_record_status_explains_lifecycle_ambiguity_supersession_and_custody() -> None:
    item = record(
        993002,
        lifecycle=RecordLifecycle.ACCEPTED,
        ambiguity_notes=("Synthetic ambiguity remains unresolved.",),
        predecessor=candidate_id(993001),
    )
    registry = CandidateIdentifierRegistry()
    registry.reserve(item.identifier)
    registry.register(item.identifier)
    explanation = ExplanationService().explain_record_status(
        item, registry.snapshot().get(item.identifier)
    )
    facts = {fact.field_path: fact.value for fact in explanation.facts}
    assert facts["record.lifecycle"] == "accepted"
    assert (
        facts["record.ambiguity_notes[0]"] == "Synthetic ambiguity remains unresolved."
    )
    assert facts["record.provenance.supersession.predecessor_id"] == str(
        candidate_id(993001)
    )
    assert facts["custody.state"] == "registered"
    codes = {item.code for item in explanation.limitations}
    assert "LIFECYCLE_NOT_SCIENTIFIC_TRUTH" in codes
    assert "CUSTODY_NOT_LIFECYCLE_OR_PROMOTION" in codes

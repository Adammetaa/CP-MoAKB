from dataclasses import FrozenInstanceError

import pytest

from cpmoakb.domain import (
    AuthorityIdentifier,
    CandidateIdentifier,
    CanonicalIdentifier,
    ExternalIdentifier,
    InvalidIdentifierError,
    RecordKind,
    SourceIdentifier,
)


def test_synthetic_candidate_identifiers_preserve_kind_and_value():
    entity = CandidateIdentifier("CPM-CAND-E-900001")
    relationship = CandidateIdentifier("CPM-CAND-R-900002")

    assert entity.kind is RecordKind.ENTITY
    assert relationship.kind is RecordKind.RELATIONSHIP
    assert str(entity) == "CPM-CAND-E-900001"


@pytest.mark.parametrize(
    "value",
    ["CPM-CAND-X-900001", "CPM-CAND-E-1", "cpm-cand-e-900001", " CPM-CAND-E-900001"],
)
def test_candidate_identifier_rejects_malformed_values(value):
    with pytest.raises(InvalidIdentifierError):
        CandidateIdentifier(value)


def test_canonical_identifier_is_opaque_and_not_interchangeable():
    canonical = CanonicalIdentifier("future-syntax:is-deferred")
    candidate = CandidateIdentifier("CPM-CAND-E-900003")

    assert canonical != candidate
    assert str(canonical) == "future-syntax:is-deferred"


def test_external_and_register_identifiers_validate_without_url_inference():
    external = ExternalIdentifier("fictional-authority", "SYN-42")

    assert external.resolver_uri is None
    assert AuthorityIdentifier("fictional:authority") == AuthorityIdentifier(
        "fictional:authority"
    )
    assert SourceIdentifier("synthetic.source:1").value == "synthetic.source:1"


def test_external_identifier_rejects_relative_resolver():
    with pytest.raises(InvalidIdentifierError):
        ExternalIdentifier("fictional", "42", "records/42")


def test_identifier_is_immutable_and_hashable():
    identifier = CandidateIdentifier("CPM-CAND-E-900004")
    assert {identifier} == {CandidateIdentifier("CPM-CAND-E-900004")}
    with pytest.raises(FrozenInstanceError):
        identifier.value = "changed"  # type: ignore[misc]

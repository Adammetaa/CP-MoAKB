from dataclasses import FrozenInstanceError
from pathlib import Path

import pytest

from cpmoakb.adapters.yaml import (
    YamlMappingError,
    YamlStructureError,
    load_candidate_yaml,
)
from cpmoakb.domain import (
    EntityRecord,
    EvidenceRole,
    RecordLifecycle,
    RelationshipRecord,
)

FIXTURES = Path(__file__).parent / "fixtures"


def _load(group, name):
    return load_candidate_yaml((FIXTURES / group / name).read_text(encoding="utf-8"))


@pytest.mark.parametrize(
    "name",
    [
        "minimal_entity.yaml",
        "multilingual_entity.yaml",
        "scientific_entity.yaml",
        "external_entity.yaml",
        "evidence_entity.yaml",
        "ambiguity_entity.yaml",
        "utf8_entity.yaml",
        "path_entity.yaml",
        "complete_entity.yaml",
    ],
)
def test_valid_entity_fixtures_map_to_immutable_entity_records(name):
    record = _load("valid", name)
    assert isinstance(record, EntityRecord)
    with pytest.raises(FrozenInstanceError):
        record.scope_note = "changed"  # type: ignore[misc]


def test_complete_representation_preserves_every_supported_concept():
    record = _load("valid", "complete_entity.yaml")

    assert isinstance(record, EntityRecord)
    assert str(record.identifier) == "CPM-CAND-E-980010"
    assert record.lifecycle is RecordLifecycle.SUPERSEDED
    assert {label.text for label in record.labels.labels} == {
        "Synthetic Complete Concept",
        "Example Alternative",
    }
    assert record.labels.preferred[0].locale == "en-GB"
    assert record.external_identifiers[0].value == "SYN-COMPLETE"
    assert record.authorities[0].version == "test-release"
    assert record.sources[0].version == "test-edition"
    assert record.evidence[0].role is EvidenceRole.CONFLICTING
    assert record.provenance.evidence_ids == ("EV-COMPLETE",)
    assert record.provenance.supersession is not None
    assert record.ambiguity_notes == ("Synthetic ambiguity retained.",)
    assert record.scientific_name is not None
    assert record.scientific_name.name == "Fictitia completa"
    assert record.classifications[0].code == "SYN-10"


def test_relationship_maps_without_graph_or_causal_inference():
    record = _load("valid", "relationship.yaml")

    assert isinstance(record, RelationshipRecord)
    assert record.predicate == "synthetic:associated-with"
    assert str(record.subject_id) == "CPM-CAND-E-980061"
    assert str(record.object_id) == "CPM-CAND-E-980062"
    assert not hasattr(record, "causes")


@pytest.mark.parametrize(
    ("name", "path", "has_cause"),
    [
        ("wrong_candidate_kind.yaml", "$.candidate_id", False),
        ("published_candidate.yaml", "$", True),
        ("duplicate_preferred_label.yaml", "$.labels", True),
        ("invalid_language_tag.yaml", "$.labels[0]", True),
        ("malformed_source_date.yaml", "$.sources[0].publication_date", True),
    ],
)
def test_domain_failures_are_translated_and_preserve_causes(name, path, has_cause):
    with pytest.raises(YamlMappingError) as captured:
        _load("invalid", name)

    assert captured.value.path == path
    assert (captured.value.__cause__ is not None) is has_cause


@pytest.mark.parametrize(
    "name",
    [
        "missing_relationship_subject.yaml",
        "missing_relationship_object.yaml",
        "empty_predicate.yaml",
    ],
)
def test_relationship_shape_failures_are_rejected(name):
    with pytest.raises(YamlStructureError) as captured:
        _load("invalid", name)

    assert captured.value is not None

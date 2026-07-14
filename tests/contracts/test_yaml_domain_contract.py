import pytest

from cpmoakb.adapters.yaml import (
    SUPPORTED_SCHEMA_VERSIONS,
    YamlMappingError,
    YamlStructureError,
    load_candidate_yaml,
)
from cpmoakb.domain import RecordKind

from ._support import SYNTHETIC_YAML, load_synthetic_record


def test_yaml_1_0_maps_and_preserves_domain_boundaries() -> None:
    first = load_synthetic_record()
    second = load_synthetic_record()
    assert SUPPORTED_SCHEMA_VERSIONS == frozenset({"1.0"})
    assert first == second
    assert first.record_kind is RecordKind.ENTITY
    assert tuple(label.text for label in first.labels.labels) == (
        "Fictional Contract Widget",
        "Imaginary Contract Device",
    )
    assert first.scientific_name is not None
    assert first.scientific_name.name not in {
        label.text for label in first.labels.labels
    }
    assert first.sources[0].identifier == first.evidence[0].source_id
    assert first.provenance.evidence_ids == (first.evidence[0].identifier,)


def test_unknown_yaml_key_remains_strictly_rejected() -> None:
    with pytest.raises(YamlStructureError):
        load_candidate_yaml(SYNTHETIC_YAML + "unknown_contract_key: true\n")


def test_identifier_kind_must_match_record_kind() -> None:
    mismatched = SYNTHETIC_YAML.replace("CPM-CAND-E-994001", "CPM-CAND-R-994001")
    with pytest.raises(YamlMappingError):
        load_candidate_yaml(mismatched)

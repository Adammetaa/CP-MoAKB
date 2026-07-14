from pathlib import Path

import pytest

from cpmoakb.adapters import (
    load_candidate_yaml,
    load_candidate_yaml_bytes,
    load_candidate_yaml_file,
)
from cpmoakb.adapters.yaml import YamlFileError
from cpmoakb.domain import EntityRecord

VALID = Path(__file__).parent / "fixtures" / "valid"


def test_public_text_bytes_and_path_loaders_return_same_record():
    path = VALID / "path_entity.yaml"
    text = path.read_text(encoding="utf-8")
    data = path.read_bytes()

    assert load_candidate_yaml(text) == load_candidate_yaml_bytes(data)
    assert load_candidate_yaml(text) == load_candidate_yaml_file(path)
    assert isinstance(load_candidate_yaml_file(path), EntityRecord)


def test_path_loader_translates_read_errors_and_preserves_cause(tmp_path):
    missing = tmp_path / "missing.yaml"
    with pytest.raises(YamlFileError) as captured:
        load_candidate_yaml_file(missing)

    assert isinstance(captured.value.__cause__, OSError)


def test_path_loader_requires_explicit_path_object():
    with pytest.raises(TypeError):
        load_candidate_yaml_file("fixture.yaml")  # type: ignore[arg-type]


def test_loader_allocates_no_identifier_or_timestamp():
    record = load_candidate_yaml_file(VALID / "minimal_entity.yaml")
    assert str(record.identifier) == "CPM-CAND-E-980001"
    assert record.provenance.creation.created_at.isoformat() == "2026-01-01"

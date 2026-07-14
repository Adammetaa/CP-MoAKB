from pathlib import Path

import pytest

from cpmoakb.adapters.yaml import (
    SUPPORTED_SCHEMA_VERSIONS,
    YamlSchemaVersionError,
    YamlStructureError,
    load_candidate_yaml,
)

FIXTURES = Path(__file__).parent / "fixtures"


def _text(group, name):
    return (FIXTURES / group / name).read_text(encoding="utf-8")


def test_only_schema_version_1_is_supported():
    assert SUPPORTED_SCHEMA_VERSIONS == frozenset({"1.0"})


@pytest.mark.parametrize(
    "name",
    [
        "missing_schema_version.yaml",
        "unsupported_schema_version.yaml",
        "numeric_schema_version.yaml",
    ],
)
def test_schema_version_is_mandatory_exact_and_quoted(name):
    with pytest.raises(YamlSchemaVersionError) as captured:
        load_candidate_yaml(_text("invalid", name))

    assert captured.value.path == "$.schema_version"


@pytest.mark.parametrize(
    ("name", "path"),
    [
        ("unknown_top_level.yaml", "$.unexpected"),
        ("unknown_nested_key.yaml", "$.labels[0].unexpected"),
        ("missing_required_key.yaml", "$.candidate_id"),
        ("incorrect_scalar_type.yaml", "$.domain_type"),
        ("embedded_relationship_object.yaml", "$.embedded_entity"),
    ],
)
def test_structure_contract_rejects_unknown_missing_and_wrong_typed_values(name, path):
    with pytest.raises(YamlStructureError) as captured:
        load_candidate_yaml(_text("invalid", name))

    assert captured.value.path == path

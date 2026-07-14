from pathlib import Path

import pytest

from cpmoakb.adapters.yaml import (
    UnsupportedYamlFeatureError,
    YamlRestrictionError,
    parse_candidate_yaml,
)

INVALID = Path(__file__).parent / "fixtures" / "invalid"


@pytest.mark.parametrize(
    "name",
    [
        "multiple_documents.yaml",
        "anchor.yaml",
        "alias.yaml",
        "merge_key.yaml",
        "custom_tag.yaml",
        "python_object_tag.yaml",
        "non_string_key.yaml",
        "complex_key.yaml",
        "binary_value.yaml",
        "yaml_set.yaml",
        "ordered_map.yaml",
        "implicit_date.yaml",
        "explicit_timestamp.yaml",
        "unsupported_null.yaml",
    ],
)
def test_prohibited_yaml_features_are_rejected(name):
    with pytest.raises(UnsupportedYamlFeatureError):
        parse_candidate_yaml((INVALID / name).read_text(encoding="utf-8"))


def test_duplicate_keys_are_rejected_with_stable_path():
    with pytest.raises(YamlRestrictionError) as captured:
        parse_candidate_yaml(
            (INVALID / "duplicate_key.yaml").read_text(encoding="utf-8")
        )

    assert captured.value.path == "$.schema_version"


def test_alias_is_prioritized_over_its_required_anchor():
    with pytest.raises(UnsupportedYamlFeatureError, match="aliases"):
        parse_candidate_yaml((INVALID / "alias.yaml").read_text(encoding="utf-8"))


def test_merge_key_has_specific_rejection():
    with pytest.raises(UnsupportedYamlFeatureError, match="merge keys"):
        parse_candidate_yaml((INVALID / "merge_key.yaml").read_text(encoding="utf-8"))

from cpmoakb.adapters.yaml import YamlMappingError


def test_error_message_is_stable_and_includes_category_path_and_hint():
    error = YamlMappingError(
        "synthetic failure",
        path="$.labels[0]",
        line=3,
        column=5,
        remediation_hint="correct the fictional fixture",
    )

    assert str(error) == (
        "mapping error at $.labels[0] (line 3, column 5): synthetic failure "
        "Hint: correct the fictional fixture"
    )

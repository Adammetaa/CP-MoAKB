from cpmoakb.runtime_api import RUNTIME_API_VERSION


def test_runtime_api_version_is_explicit_and_stable() -> None:
    assert RUNTIME_API_VERSION == "0.1"

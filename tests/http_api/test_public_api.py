import cpmoakb.http_api as http_api


def test_http_version_and_public_exports_are_exact() -> None:
    assert http_api.RUNTIME_HTTP_API_VERSION == "0.1"
    assert set(http_api.__all__) == {"RUNTIME_HTTP_API_VERSION", "create_http_app"}

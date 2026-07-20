import cpmoakb.cli as cli


def test_cli_version_and_public_exports_are_exact() -> None:
    assert cli.RUNTIME_CLI_API_VERSION == "0.1"
    assert set(cli.__all__) == {"RUNTIME_CLI_API_VERSION", "run_cli"}

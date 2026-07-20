from pathlib import Path

ROOT = Path(__file__).parents[2]


def test_manifest_explicitly_excludes_sensitive_and_non_runtime_roots() -> None:
    manifest = (ROOT / "MANIFEST.in").read_text(encoding="utf-8")
    for root in (".github", "data", "docs", "references", "tests", "tmp", "validation"):
        assert f"prune {root}" in manifest
    for suffix in ("*.csv", "*.db", "*.pdf", "*.sqlite", "*.sqlite3"):
        assert suffix in manifest


def test_only_governed_sql_schema_is_declared_as_package_data() -> None:
    pyproject = (ROOT / "pyproject.toml").read_text(encoding="utf-8")
    assert '"cpmoakb.database" = ["schema.sql"]' in pyproject
    assert "include-package-data = false" in pyproject


def test_ci_type_check_does_not_create_cache_databases() -> None:
    workflow = (ROOT / ".github" / "workflows" / "ci.yml").read_text(encoding="utf-8")
    assert "--no-incremental" in workflow

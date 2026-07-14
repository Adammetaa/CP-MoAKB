import ast
from pathlib import Path

ROOT = Path(__file__).parents[2]
QUERY = ROOT / "cpmoakb" / "query"


def imported_modules(path: Path) -> set[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"))
    modules: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            modules.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            modules.add("." * node.level + (node.module or ""))
    return modules


def package_imports(path: Path) -> set[str]:
    return set().union(*(imported_modules(module) for module in path.rglob("*.py")))


def test_runtime_dependencies_do_not_import_query() -> None:
    packages = (
        ROOT / "cpmoakb" / "domain",
        ROOT / "cpmoakb" / "adapters" / "yaml",
        ROOT / "cpmoakb" / "validation" / "builtins",
        ROOT / "cpmoakb" / "registries",
    )
    for package in packages:
        assert not any("query" in name for name in package_imports(package))


def test_query_has_no_prohibited_dependencies() -> None:
    prohibited = (
        "yaml",
        "parser",
        "export",
        "sqlite",
        "database",
        "requests",
        "httpx",
        "urllib",
        "socket",
        "explain",
        "scientific",
    )
    assert not any(
        fragment in name.lower()
        for name in package_imports(QUERY)
        for fragment in prohibited
    )


def test_query_imports_are_limited_to_approved_runtime_apis() -> None:
    allowed = {
        "__future__",
        "collections.abc",
        "dataclasses",
        "re",
        "types",
        "typing",
        "unicodedata",
        "enum",
        "cpmoakb.domain",
        "cpmoakb.registries",
        ".criteria",
        ".enums",
        ".errors",
        ".indexes",
        ".results",
        ".services",
    }
    assert package_imports(QUERY) <= allowed


def test_no_global_query_singleton_exists() -> None:
    class_names = {"QueryService", "ReadOnlyQueryIndex", "RegistrySnapshotQueryService"}
    for path in QUERY.glob("*.py"):
        tree = ast.parse(path.read_text(encoding="utf-8"))
        for node in tree.body:
            if isinstance(node, (ast.Assign, ast.AnnAssign)):
                value = node.value
                assert not (
                    isinstance(value, ast.Call)
                    and isinstance(value.func, ast.Name)
                    and value.func.id in class_names
                )


def test_query_source_contains_no_inference_or_auto_validation_hooks() -> None:
    source = "\n".join(path.read_text(encoding="utf-8") for path in QUERY.glob("*.py"))
    prohibited_calls = (
        "validate_record(",
        "validate_records(",
        ".allocate(",
        ".register(",
        "fuzzy",
        "transliterate",
        "translate(",
    )
    assert not any(call in source for call in prohibited_calls)


def test_public_api_imports() -> None:
    from cpmoakb.query import (
        QueryCriteria,
        QueryService,
        ReadOnlyQueryIndex,
        RegistrySnapshotQueryService,
        TextMatchMode,
    )

    assert TextMatchMode.EXACT.value == "exact"
    assert QueryCriteria is not None
    assert QueryService is not None
    assert ReadOnlyQueryIndex is not None
    assert RegistrySnapshotQueryService is not None

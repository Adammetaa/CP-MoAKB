import ast
from pathlib import Path

ROOT = Path(__file__).parents[2]
EXPLAIN = ROOT / "cpmoakb" / "explain"


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


def test_runtime_dependencies_do_not_import_explain() -> None:
    packages = (
        ROOT / "cpmoakb" / "domain",
        ROOT / "cpmoakb" / "adapters",
        ROOT / "cpmoakb" / "validation",
        ROOT / "cpmoakb" / "registries",
        ROOT / "cpmoakb" / "query",
    )
    for package in packages:
        assert not any("explain" in name for name in package_imports(package))


def test_explain_has_no_prohibited_dependencies() -> None:
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
        "openai",
        "transformers",
        "langchain",
        "diagnosis",
        "recommendation",
    )
    assert not any(
        fragment in name.lower()
        for name in package_imports(EXPLAIN)
        for fragment in prohibited
    )


def test_explain_imports_are_limited_to_approved_runtime_apis() -> None:
    allowed = {
        "__future__",
        "dataclasses",
        "enum",
        "cpmoakb.domain",
        "cpmoakb.query",
        "cpmoakb.registries",
        "cpmoakb.validation",
        ".builders",
        ".enums",
        ".errors",
        ".models",
        ".renderers",
        ".services",
    }
    assert package_imports(EXPLAIN) <= allowed


def test_no_global_explanation_service_exists() -> None:
    for path in EXPLAIN.glob("*.py"):
        tree = ast.parse(path.read_text(encoding="utf-8"))
        for node in tree.body:
            if isinstance(node, (ast.Assign, ast.AnnAssign)):
                value = node.value
                assert not (
                    isinstance(value, ast.Call)
                    and isinstance(value.func, ast.Name)
                    and value.func.id == "ExplanationService"
                )


def test_query_and_validation_do_not_auto_run_explanations() -> None:
    for package in (ROOT / "cpmoakb" / "query", ROOT / "cpmoakb" / "validation"):
        source = "\n".join(
            path.read_text(encoding="utf-8") for path in package.rglob("*.py")
        )
        assert "cpmoakb.explain" not in source
        assert "ExplanationService(" not in source


def test_public_api_imports() -> None:
    from cpmoakb.explain import (
        Explanation,
        ExplanationService,
        ExplanationType,
        build_query_match_explanation,
        render_explanation,
    )

    assert ExplanationType.QUERY_MATCH.value == "query_match"
    assert Explanation is not None
    assert ExplanationService is not None
    assert callable(build_query_match_explanation)
    assert callable(render_explanation)

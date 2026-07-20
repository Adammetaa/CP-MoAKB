import ast
from pathlib import Path

ROOT = Path(__file__).parents[2]


def imports(path: Path) -> set[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"))
    found: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            found.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            found.add("." * node.level + (node.module or ""))
    return found


def package_imports(package: str, *, exclude: set[str] | None = None) -> set[str]:
    excluded = exclude or set()
    files = (
        path
        for path in (ROOT / "cpmoakb" / package).rglob("*.py")
        if path.name not in excluded
    )
    return set().union(*(imports(path) for path in files))


def test_runtime_layer_direction() -> None:
    assert not any(name.startswith("cpmoakb.") for name in package_imports("domain"))
    allowed_dependencies = {
        "adapters": ("cpmoakb.domain",),
        "registries": ("cpmoakb.domain",),
        "query": ("cpmoakb.domain", "cpmoakb.registries"),
        "explain": (
            "cpmoakb.domain",
            "cpmoakb.validation",
            "cpmoakb.registries",
            "cpmoakb.query",
        ),
    }
    for package, allowed in allowed_dependencies.items():
        absolute_runtime_imports = {
            name for name in package_imports(package) if name.startswith("cpmoakb.")
        }
        assert all(name.startswith(allowed) for name in absolute_runtime_imports)
    validation_runtime = package_imports(
        "validation", exclude={"__init__.py", "irac_validator.py"}
    )
    assert not any(
        "adapter" in name or "registr" in name or "query" in name or "explain" in name
        for name in validation_runtime
    )


def test_runtime_has_no_prohibited_external_dependencies() -> None:
    prohibited = (
        "requests",
        "httpx",
        "socket",
        "sqlite",
        "database",
        "cpmoakb.export",
        "cpmoakb.parser",
        "pickle",
        "openai",
        "langchain",
        "transformers",
    )
    combined = set().union(
        package_imports("domain"),
        package_imports("adapters"),
        package_imports("registries"),
        package_imports("query"),
        package_imports("explain"),
        package_imports("validation", exclude={"irac_validator.py"}),
    )
    assert not any(
        fragment in name.lower() for name in combined for fragment in prohibited
    )


def test_composition_direction_is_narrow_and_lower_layers_do_not_import_it() -> None:
    composition_imports = package_imports("composition")
    assert {name for name in composition_imports if name.startswith("cpmoakb.")} <= {
        "cpmoakb.application",
        "cpmoakb.explain",
        "cpmoakb.query",
    }
    for package in (
        "domain",
        "adapters",
        "validation",
        "registries",
        "query",
        "explain",
        "serialization",
        "application",
    ):
        assert "cpmoakb.composition" not in package_imports(package)

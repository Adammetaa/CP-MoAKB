import ast
from pathlib import Path

ROOT = Path(__file__).parents[2]
REGISTRIES = ROOT / "cpmoakb" / "registries"


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


def test_domain_and_yaml_adapter_do_not_import_registries() -> None:
    for package in (
        ROOT / "cpmoakb" / "domain",
        ROOT / "cpmoakb" / "adapters" / "yaml",
    ):
        assert not any("registr" in name for name in package_imports(package))


def test_registries_have_no_prohibited_dependencies() -> None:
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
        "query",
        "explain",
    )
    assert not any(
        fragment in name.lower()
        for name in package_imports(REGISTRIES)
        for fragment in prohibited
    )


def test_validation_builtins_do_not_import_registries() -> None:
    imports = package_imports(ROOT / "cpmoakb" / "validation" / "builtins")
    assert not any("registr" in name for name in imports)


def test_registry_imports_are_limited_to_standard_library_domain_and_local_modules() -> (
    None
):
    allowed = {
        "__future__",
        "dataclasses",
        "enum",
        "cpmoakb.domain",
        ".authorities",
        ".enums",
        ".errors",
        ".identifiers",
        ".snapshots",
        ".sources",
    }
    assert package_imports(REGISTRIES) <= allowed


def test_no_module_level_registry_singletons_exist() -> None:
    registry_class_names = {
        "AuthorityRegistry",
        "CandidateIdentifierRegistry",
        "SourceRegistry",
    }
    for path in REGISTRIES.glob("*.py"):
        tree = ast.parse(path.read_text(encoding="utf-8"))
        for node in tree.body:
            if isinstance(node, (ast.Assign, ast.AnnAssign)):
                value = node.value
                assert not (
                    isinstance(value, ast.Call)
                    and isinstance(value.func, ast.Name)
                    and value.func.id in registry_class_names
                )


def test_public_api_imports() -> None:
    from cpmoakb.registries import (
        AuthorityRegistry,
        CandidateIdentifierRegistry,
        CandidateIdentifierState,
        SourceRegistry,
    )

    assert CandidateIdentifierState.RESERVED.value == "reserved"
    assert AuthorityRegistry is not None
    assert CandidateIdentifierRegistry is not None
    assert SourceRegistry is not None

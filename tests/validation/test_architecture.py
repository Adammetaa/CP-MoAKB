import ast
from pathlib import Path

ROOT = Path(__file__).parents[2]
VALIDATION = ROOT / "cpmoakb" / "validation"


def imported_modules(path: Path) -> set[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"))
    modules: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            modules.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            modules.add("." * node.level + (node.module or ""))
    return modules


def test_domain_does_not_import_validation_engine() -> None:
    imports = set().union(
        *(imported_modules(path) for path in (ROOT / "cpmoakb" / "domain").glob("*.py"))
    )
    assert not any(name.startswith("cpmoakb.validation") for name in imports)


def test_validation_has_no_prohibited_dependencies() -> None:
    runtime_files = tuple(
        path
        for path in VALIDATION.rglob("*.py")
        if path.name not in {"__init__.py", "irac_validator.py"}
    )
    imports = set().union(*(imported_modules(path) for path in runtime_files))
    prohibited_fragments = (
        "yaml",
        "adapter",
        "parser",
        "export",
        "database",
        "sqlite",
        "semantic",
        "requests",
        "urllib",
        "network",
        "registry",
        "query",
        "explanation",
    )
    assert not any(
        fragment in name.lower()
        for name in imports
        for fragment in prohibited_fragments
    )


def test_builtin_rules_import_only_standard_library_domain_and_validation() -> None:
    imports = set().union(
        *(imported_modules(path) for path in (VALIDATION / "builtins").glob("*.py"))
    )
    allowed_roots = {
        "__future__",
        "collections",
        "cpmoakb.domain",
        "dataclasses",
        ".cross_object",
        ".domain",
        ".structural",
        "..context",
        "..enums",
        "..errors",
        "..rules",
    }
    assert all(
        any(name == root or name.startswith(f"{root}.") for root in allowed_roots)
        for name in imports
    )


def test_no_scientific_rule_module_or_registration_exists() -> None:
    assert not (VALIDATION / "builtins" / "scientific.py").exists()
    source = "\n".join(
        path.read_text(encoding="utf-8") for path in VALIDATION.rglob("*.py")
    )
    assert "SCIENTIFIC_RULES" not in source


def test_public_imports_preserve_legacy_and_expose_runtime_engine() -> None:
    from cpmoakb.validation import (
        GENERIC_CANDIDATE_PROFILE,
        ValidationFinding,
        ValidationLayer,
        validate_irac_document,
        validate_record,
    )

    assert ValidationLayer.STRUCTURAL.value == "structural"
    assert GENERIC_CANDIDATE_PROFILE.rule_ids
    assert callable(validate_record)
    assert callable(validate_irac_document)
    assert ValidationFinding is not None


def test_yaml_adapter_does_not_auto_run_runtime_validation() -> None:
    source = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (ROOT / "cpmoakb" / "adapters" / "yaml").glob("*.py")
    )
    assert "cpmoakb.validation" not in source
    assert "validate_record(" not in source

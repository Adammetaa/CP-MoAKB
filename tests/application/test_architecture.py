import ast
from pathlib import Path

ROOT = Path(__file__).parents[2]
LOWER_LAYERS = (
    "domain",
    "adapters",
    "validation",
    "registries",
    "query",
    "explain",
    "serialization",
    "parsers",
    "exporters",
    "database",
)


def _imports(path: Path) -> set[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"))
    found: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            found.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            found.add("." * node.level + (node.module or ""))
    return found


def test_lower_layers_do_not_import_application() -> None:
    for package in LOWER_LAYERS:
        for path in (ROOT / "cpmoakb" / package).rglob("*.py"):
            assert not any(
                name.startswith("cpmoakb.application") for name in _imports(path)
            )


def test_application_imports_only_approved_runtime_layers() -> None:
    files = tuple((ROOT / "cpmoakb" / "application").glob("*.py"))
    imports = set().union(*(_imports(path) for path in files))
    runtime_imports = {name for name in imports if name.startswith("cpmoakb.")}
    allowed = (
        "cpmoakb.query",
        "cpmoakb.explain",
        "cpmoakb.serialization",
        "cpmoakb.runtime_api",
    )
    assert all(name.startswith(allowed) for name in runtime_imports)
    prohibited = (
        "fastapi",
        "flask",
        "django",
        "requests",
        "httpx",
        "socket",
        "sqlite",
        "pathlib",
        "pickle",
        "subprocess",
        "os",
    )
    assert not any(
        name.casefold() == fragment or name.casefold().startswith(f"{fragment}.")
        for name in imports
        for fragment in prohibited
    )


def test_application_contains_no_dynamic_execution_or_deserialization() -> None:
    combined = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (ROOT / "cpmoakb" / "application").glob("*.py")
    )
    for prohibited in ("eval(", "exec(", "json.loads(", "import_module(", "open("):
        assert prohibited not in combined

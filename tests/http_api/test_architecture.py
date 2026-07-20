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
    "application",
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


def test_lower_layers_do_not_import_http_api() -> None:
    for package in LOWER_LAYERS:
        for path in (ROOT / "cpmoakb" / package).rglob("*.py"):
            assert not any(
                name.startswith("cpmoakb.http_api") for name in _imports(path)
            )


def test_http_api_imports_only_application_and_transport_safe_constants() -> None:
    files = tuple((ROOT / "cpmoakb" / "http_api").glob("*.py"))
    imports = set().union(*(_imports(path) for path in files))
    runtime_imports = {name for name in imports if name.startswith("cpmoakb.")}
    allowed = (
        "cpmoakb.application",
        "cpmoakb.runtime_api",
        "cpmoakb.serialization",
    )
    assert all(name.startswith(allowed) for name in runtime_imports)
    prohibited_roots = (
        "sqlite3",
        "pathlib",
        "pickle",
        "subprocess",
        "socket",
        "requests",
        "httpx",
        "os",
        "importlib",
    )
    assert not any(
        name == root or name.startswith(f"{root}.")
        for name in imports
        for root in prohibited_roots
    )


def test_http_package_has_no_prohibited_execution_or_routes() -> None:
    combined = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (ROOT / "cpmoakb" / "http_api").glob("*.py")
    )
    for prohibited in (
        "eval(",
        "exec(",
        "pickle",
        "import_module(",
        "uvicorn",
        "UploadFile",
        "File(",
        "yaml",
        "diagnos",
        "recommend",
        "registry",
    ):
        assert prohibited not in combined

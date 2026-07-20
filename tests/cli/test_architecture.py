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
    "http_api",
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


def test_lower_layers_do_not_import_cli() -> None:
    for package in LOWER_LAYERS:
        for path in (ROOT / "cpmoakb" / package).rglob("*.py"):
            assert not any(name.startswith("cpmoakb.cli") for name in _imports(path))


def test_cli_imports_application_and_public_version_boundaries_only() -> None:
    files = tuple((ROOT / "cpmoakb" / "cli").glob("*.py"))
    imports = set().union(*(_imports(path) for path in files))
    runtime_imports = {name for name in imports if name.startswith("cpmoakb.")}
    allowed = {
        "cpmoakb.application",
        "cpmoakb.http_api",
        "cpmoakb.runtime_api",
        "cpmoakb.serialization",
    }
    assert runtime_imports <= allowed
    prohibited_roots = (
        "pathlib",
        "pickle",
        "subprocess",
        "socket",
        "requests",
        "httpx",
        "httpx2",
        "os",
        "importlib",
        "yaml",
        "sqlite3",
    )
    assert not any(
        name == root or name.startswith(f"{root}.")
        for name in imports
        for root in prohibited_roots
    )


def test_cli_has_no_prohibited_execution_input_or_commands() -> None:
    combined = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (ROOT / "cpmoakb" / "cli").glob("*.py")
    )
    for prohibited in (
        "eval(",
        "exec(",
        "pickle",
        "import_module(",
        "subprocess",
        "os.environ",
        "sys.argv",
        "open(",
        "--path",
        "--url",
        "--json",
        "--yaml",
        "diagnosis",
        "recommendation",
        "registry",
    ):
        assert prohibited not in combined

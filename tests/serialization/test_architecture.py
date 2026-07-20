import ast
from pathlib import Path

ROOT = Path(__file__).parents[2]
LOWER_LAYERS = ("domain", "adapters", "validation", "registries", "query", "explain")


def _imports(path: Path) -> set[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"))
    found: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            found.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            found.add("." * node.level + (node.module or ""))
    return found


def test_lower_runtime_layers_do_not_import_serialization() -> None:
    for package in LOWER_LAYERS:
        for path in (ROOT / "cpmoakb" / package).rglob("*.py"):
            assert not any(
                name.startswith("cpmoakb.serialization") for name in _imports(path)
            )


def test_serialization_has_no_prohibited_dependencies_or_reflection() -> None:
    files = tuple((ROOT / "cpmoakb" / "serialization").glob("*.py"))
    imports = set().union(*(_imports(path) for path in files))
    prohibited_imports = {
        "pickle",
        "sqlite3",
        "requests",
        "httpx",
        "pydantic",
        "marshmallow",
    }
    assert imports.isdisjoint(prohibited_imports)
    combined = "\n".join(path.read_text(encoding="utf-8") for path in files)
    for prohibited_text in ("asdict(", ".__dict__", "default=", "repr("):
        assert prohibited_text not in combined

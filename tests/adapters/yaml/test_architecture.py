import ast
from pathlib import Path

import cpmoakb.adapters as public_adapters
import cpmoakb.adapters.yaml as public_yaml

ROOT = Path(__file__).parents[3]
DOMAIN = ROOT / "cpmoakb" / "domain"
ADAPTER = ROOT / "cpmoakb" / "adapters" / "yaml"


def _imports(path):
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    result = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            result.extend(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.level == 0 and node.module:
            result.append(node.module)
    return tuple(result)


def test_domain_has_no_yaml_or_adapter_reverse_dependency():
    imports = {name for path in DOMAIN.glob("*.py") for name in _imports(path)}
    assert not any(name == "yaml" or name.startswith("yaml.") for name in imports)
    assert not any(name.startswith("cpmoakb.adapters") for name in imports)


def test_yaml_adapter_imports_only_allowed_layers():
    imports = {name for path in ADAPTER.glob("*.py") for name in _imports(path)}
    forbidden = (
        "cpmoakb.parsers",
        "cpmoakb.exporters",
        "cpmoakb.database",
        "cpmoakb.validation",
        "sqlite3",
        "requests",
        "httpx",
        "urllib.request",
        "socket",
    )
    assert not any(
        name == item or name.startswith(f"{item}.")
        for item in forbidden
        for name in imports
    )
    allowed_standard_roots = {
        "__future__",
        "collections",
        "datetime",
        "math",
        "pathlib",
        "typing",
        "yaml",
    }
    for name in imports:
        assert (
            name.startswith("cpmoakb.domain")
            or name.split(".", 1)[0] in allowed_standard_roots
        )


def test_public_api_exports_only_intentional_entry_points():
    assert public_adapters.load_candidate_yaml is public_yaml.load_candidate_yaml
    assert public_yaml.SUPPORTED_SCHEMA_VERSIONS == frozenset({"1.0"})
    assert not hasattr(public_yaml, "SafeLoader")


def test_adapter_source_has_no_network_or_unsafe_loader_calls():
    source = "\n".join(
        path.read_text(encoding="utf-8") for path in ADAPTER.glob("*.py")
    )
    assert "yaml.load(" not in source
    assert "UnsafeLoader" not in source
    assert "FullLoader" not in source
    assert "urlopen" not in source

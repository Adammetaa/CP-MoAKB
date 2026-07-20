"""Deterministically enforce RAS-013 prohibited operations in governed code."""

from __future__ import annotations

import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GOVERNED_ROOTS = (
    Path("cpmoakb/runtime_api.py"),
    Path("cpmoakb/domain"),
    Path("cpmoakb/adapters"),
    Path("cpmoakb/validation"),
    Path("cpmoakb/registries"),
    Path("cpmoakb/query"),
    Path("cpmoakb/explain"),
    Path("cpmoakb/serialization"),
    Path("cpmoakb/application"),
    Path("cpmoakb/http_api"),
    Path("cpmoakb/cli"),
    Path("cpmoakb/composition"),
)
EXCLUDED_FILES = frozenset({Path("cpmoakb/validation/irac_validator.py")})
PROHIBITED_IMPORTS = (
    "importlib",
    "pickle",
    "requests",
    "httpx",
    "httpx2",
    "socket",
    "subprocess",
    "traceback",
    "urllib.request",
)
PROHIBITED_CALLS = frozenset({"__import__", "eval", "exec"})
PROHIBITED_ATTRIBUTES = frozenset(
    {
        "glob",
        "import_module",
        "iterdir",
        "listdir",
        "popen",
        "rglob",
        "scandir",
        "system",
        "urlopen",
        "walk",
    }
)
ALLOWED_REPR_CALLS = frozenset({(Path("cpmoakb/validation/engine.py"), 65)})


class SecurityContractError(RuntimeError):
    """Governed code violates the static RAS-013 security contract."""


def governed_files() -> tuple[Path, ...]:
    """Return repository-relative governed Python files in stable order."""

    files: set[Path] = set()
    for relative in GOVERNED_ROOTS:
        absolute = ROOT / relative
        if absolute.is_file():
            files.add(relative)
        else:
            files.update(path.relative_to(ROOT) for path in absolute.rglob("*.py"))
    return tuple(sorted(files - EXCLUDED_FILES, key=lambda path: path.as_posix()))


def _qualified_name(node: ast.expr) -> str:
    if isinstance(node, ast.Name):
        return node.id
    if isinstance(node, ast.Attribute):
        prefix = _qualified_name(node.value)
        return f"{prefix}.{node.attr}" if prefix else node.attr
    return ""


def _is_prohibited_import(name: str) -> bool:
    return any(
        name == root or name.startswith(f"{root}.") for root in PROHIBITED_IMPORTS
    )


def _violations(path: Path) -> tuple[str, ...]:
    tree = ast.parse(
        (ROOT / path).read_text(encoding="utf-8"), filename=path.as_posix()
    )
    violations: list[str] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                if _is_prohibited_import(alias.name):
                    violations.append(
                        f"{path.as_posix()}:{node.lineno}: prohibited import {alias.name}"
                    )
        elif isinstance(node, ast.ImportFrom):
            module = node.module or ""
            if any(alias.name == "*" for alias in node.names):
                violations.append(f"{path.as_posix()}:{node.lineno}: wildcard import")
            if node.level == 0 and _is_prohibited_import(module):
                violations.append(
                    f"{path.as_posix()}:{node.lineno}: prohibited import {module}"
                )
        elif isinstance(node, ast.Call):
            name = _qualified_name(node.func)
            leaf = name.rsplit(".", 1)[-1]
            if leaf in PROHIBITED_CALLS:
                violations.append(
                    f"{path.as_posix()}:{node.lineno}: prohibited call {leaf}"
                )
            if leaf in PROHIBITED_ATTRIBUTES:
                violations.append(
                    f"{path.as_posix()}:{node.lineno}: prohibited discovery/execution call {leaf}"
                )
            if name in {"os.getenv", "os.environ.get"}:
                violations.append(
                    f"{path.as_posix()}:{node.lineno}: prohibited environment lookup"
                )
            if leaf == "repr" and (path, node.lineno) not in ALLOWED_REPR_CALLS:
                violations.append(
                    f"{path.as_posix()}:{node.lineno}: unapproved repr call"
                )
            for keyword in node.keywords:
                if (
                    keyword.arg == "shell"
                    and isinstance(keyword.value, ast.Constant)
                    and keyword.value.value is True
                ):
                    violations.append(f"{path.as_posix()}:{node.lineno}: shell=True")
                if (
                    keyword.arg == "default"
                    and isinstance(keyword.value, ast.Name)
                    and keyword.value.id == "str"
                ):
                    violations.append(
                        f"{path.as_posix()}:{node.lineno}: default=str fallback"
                    )
        elif (
            isinstance(node, ast.Subscript)
            and _qualified_name(node.value) == "os.environ"
        ):
            violations.append(
                f"{path.as_posix()}:{node.lineno}: prohibited environment lookup"
            )
    return tuple(violations)


def verify() -> tuple[Path, ...]:
    """Raise one stable error containing all governed-code violations."""

    files = governed_files()
    violations = tuple(violation for path in files for violation in _violations(path))
    if violations:
        raise SecurityContractError(
            "security contract violations:\n" + "\n".join(violations)
        )
    return files


def main() -> int:
    files = verify()
    print(f"security contract verified: {len(files)} governed files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

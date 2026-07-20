"""Execute the explicit example manifest deterministically and without caches.

Subprocesses are appropriate here because this development-only verifier must
prove each documented module is independently executable. Runtime/public package
code remains subprocess-free under RAS-013.
"""

from __future__ import annotations

import ast
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "examples" / "examples.json"
EXPECTED_IDS = (
    "minimal",
    "query",
    "query-and-explain",
    "serialization",
    "composition",
    "http",
    "cli",
    "embedding",
    "testing",
)
PROHIBITED_IMPORTS = frozenset(
    {
        "httpx",
        "httpx2",
        "importlib",
        "os",
        "pathlib",
        "pickle",
        "requests",
        "socket",
        "subprocess",
        "tests",
        "urllib",
    }
)


class ExampleVerificationError(RuntimeError):
    """One or more governed examples violate their manifest contract."""


def _normalized(value: bytes) -> str:
    return value.decode("utf-8").replace("\r\n", "\n")


def _status() -> bytes:
    result = subprocess.run(
        ["git", "status", "--porcelain", "--untracked-files=all", "-z"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    )
    return result.stdout


def load_manifest() -> dict[str, Any]:
    value = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if (
        value.get("schema") != "cpmoakb-examples"
        or value.get("schema_version") != "1.0"
    ):
        raise ExampleVerificationError("example manifest identity mismatch")
    return value


def _source_violations(module: str) -> tuple[str, ...]:
    path = ROOT.joinpath(*module.split(".")).with_suffix(".py")
    if not path.is_file():
        return (f"missing example entry point: {module}",)
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=path.as_posix())
    violations: list[str] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            names = tuple(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom):
            names = (node.module or "",)
        else:
            continue
        for name in names:
            root = name.split(".", 1)[0]
            if root in PROHIBITED_IMPORTS:
                violations.append(
                    f"{path.relative_to(ROOT).as_posix()}: prohibited import {name}"
                )
    return tuple(violations)


def _run(module: str) -> subprocess.CompletedProcess[bytes]:
    return subprocess.run(
        [sys.executable, "-B", "-m", module],
        cwd=ROOT,
        check=False,
        capture_output=True,
    )


def verify() -> tuple[str, ...]:
    manifest = load_manifest()
    examples = manifest.get("examples")
    if not isinstance(examples, list):
        raise ExampleVerificationError("example manifest entries must be a list")
    identifiers = tuple(entry.get("id") for entry in examples)
    failures: list[str] = []
    if identifiers != EXPECTED_IDS:
        failures.append("example manifest identifiers or ordering mismatch")
    failures.extend(_source_violations("examples._support"))
    before = _status()
    for entry in examples:
        identifier = entry.get("id")
        module = entry.get("module")
        directory = entry.get("directory")
        if not isinstance(identifier, str) or not isinstance(module, str):
            failures.append("example entry identity must be text")
            continue
        if (
            not isinstance(directory, str)
            or not (ROOT / directory / "README.md").is_file()
        ):
            failures.append(f"missing example README: {identifier}")
        elif f"python -m {module}" not in (ROOT / directory / "README.md").read_text(
            encoding="utf-8"
        ):
            failures.append(f"missing documented example command: {identifier}")
        if entry.get("required_extra") not in {"core", "http"}:
            failures.append(f"invalid required extra: {identifier}")
        failures.extend(_source_violations(module))
        first = _run(module)
        second = _run(module)
        if (
            first.returncode != entry.get("expected_exit")
            or second.returncode != first.returncode
        ):
            failures.append(f"unexpected exit status: {identifier}")
        if first.stdout != second.stdout or first.stderr != second.stderr:
            failures.append(f"nondeterministic process output: {identifier}")
        output = _normalized(first.stdout)
        error = _normalized(first.stderr)
        if error:
            failures.append(f"unexpected stderr: {identifier}")
        expected = entry.get("expected_output")
        if isinstance(expected, str) and output != expected:
            failures.append(f"stdout contract mismatch: {identifier}")
        contains = entry.get("expected_contains", [])
        if not isinstance(contains, list) or any(
            not isinstance(marker, str) or marker not in output for marker in contains
        ):
            failures.append(f"stdout marker mismatch: {identifier}")
    if manifest.get("documentation_only") != ["examples/extension_boundary"]:
        failures.append("documentation-only example boundary mismatch")
    if _status() != before:
        failures.append("example execution modified repository-visible files")
    if failures:
        raise ExampleVerificationError(
            "example verification failures:\n" + "\n".join(sorted(set(failures)))
        )
    return EXPECTED_IDS


def main() -> int:
    identifiers = verify()
    print(f"examples verified: {len(identifiers)} executable, 1 documentation-only")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

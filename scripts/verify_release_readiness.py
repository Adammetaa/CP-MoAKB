"""Read-only deterministic verification of governed release-readiness evidence."""

from __future__ import annotations

import argparse
import ast
import hashlib
import json
import re
import subprocess
import sys
import tomllib
from pathlib import Path
from typing import Any

REPOSITORY_ROOT = Path(__file__).resolve().parents[1]
if str(REPOSITORY_ROOT) not in sys.path:
    sys.path.insert(0, str(REPOSITORY_ROOT))

from scripts.verify_distribution import verify as verify_distribution  # noqa: E402
from scripts.verify_security_contract import (  # noqa: E402
    ROOT,
    verify as verify_security,
)

LICENSE_SHA256 = "c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4"
ACTION_PINS = {
    "actions/checkout": ("9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0", "v7"),
    "actions/setup-python": ("ece7cb06caefa5fff74198d8649806c4678c61a1", "v6"),
}
REQUIRED_DOCUMENTS = (
    "SECURITY.md",
    "docs/security/security-model.md",
    "docs/security/threat-model.md",
    "docs/security/dependency-policy.md",
    "docs/security/release-security-checklist.md",
    "docs/release/release-readiness-checklist.md",
    "docs/release/compatibility-audit.md",
    "docs/runtime/specifications/RAS-013-runtime-security-and-release-readiness-contract.md",
    "release/release-readiness.json",
    "docs/release/release-candidate-manifest.json",
    "docs/release/open-source-release-audit.md",
    "docs/release/license-and-attribution-audit.md",
    "references/IRAC/retrieval.md",
)
ALLOWED_FROZEN_CSV = frozenset(
    {
        "validation/Active_Ingredient.csv",
        "validation/Chemical_Class.csv",
        "validation/MoA_Group.csv",
    }
)
EXPECTED_VERSIONS = {
    "package": "0.1.0",
    "runtime": "0.1",
    "yaml": "1.0",
    "projection": "1.0",
    "application": "0.1",
    "http": "0.1",
    "cli": "0.1",
    "composition": "0.1",
}


class ReleaseReadinessError(RuntimeError):
    """Repository evidence violates the governed release-readiness contract."""


def _failures() -> list[str]:
    return []


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _assignment(relative: str, name: str) -> Any:
    tree = ast.parse(_read(relative), filename=relative)
    for node in tree.body:
        if isinstance(node, (ast.Assign, ast.AnnAssign)):
            targets = node.targets if isinstance(node, ast.Assign) else (node.target,)
            if any(
                isinstance(target, ast.Name) and target.id == name for target in targets
            ):
                if node.value is None:
                    raise ReleaseReadinessError(
                        f"missing static assignment value: {relative}:{name}"
                    )
                return ast.literal_eval(node.value)
    raise ReleaseReadinessError(f"missing static assignment: {relative}:{name}")


def authoritative_versions() -> dict[str, str]:
    yaml_source = _read("cpmoakb/adapters/yaml/schema.py")
    match = re.search(
        r'SUPPORTED_SCHEMA_VERSIONS = frozenset\(\{"([^"]+)"\}\)', yaml_source
    )
    if match is None:
        raise ReleaseReadinessError("YAML schema version source is not static")
    return {
        "package": _assignment("cpmoakb/_version.py", "__version__"),
        "runtime": _assignment("cpmoakb/runtime_api.py", "RUNTIME_API_VERSION"),
        "yaml": match.group(1),
        "projection": _assignment(
            "cpmoakb/serialization/json_projection.py",
            "RUNTIME_JSON_PROJECTION_VERSION",
        ),
        "application": _assignment(
            "cpmoakb/application/services.py", "RUNTIME_APPLICATION_API_VERSION"
        ),
        "http": _assignment("cpmoakb/http_api/version.py", "RUNTIME_HTTP_API_VERSION"),
        "cli": _assignment("cpmoakb/cli/main.py", "RUNTIME_CLI_API_VERSION"),
        "composition": _assignment(
            "cpmoakb/composition/__init__.py", "RUNTIME_COMPOSITION_API_VERSION"
        ),
    }


def _verify_metadata(failures: list[str]) -> None:
    document = tomllib.loads(_read("pyproject.toml"))
    project = document["project"]
    if project["name"] != "cp-moakb" or project["requires-python"] != ">=3.11,<3.13":
        failures.append("package identity or Python bounds mismatch")
    if project["license"] != "Apache-2.0" or project["license-files"] != ["LICENSE"]:
        failures.append("license metadata mismatch")
    if document["build-system"] != {
        "requires": ["setuptools==83.0.0"],
        "build-backend": "setuptools.build_meta",
    }:
        failures.append("build backend policy mismatch")
    requirements = tuple(project["dependencies"])
    extras = project["optional-dependencies"]
    all_direct = requirements + tuple(extras["http"]) + tuple(extras["dev"])
    if any(
        re.fullmatch(r"[A-Za-z0-9_.-]+==[^\s;]+", value) is None for value in all_direct
    ):
        failures.append("direct dependencies must use exact pins")
    if any(
        re.search(r"(https?://|git\+|file:|\s@\s|^-e\s)", value, re.IGNORECASE)
        for value in all_direct
    ):
        failures.append("URL, Git, local-path, or editable dependency declared")
    if extras["http"] != ["fastapi==0.139.2"]:
        failures.append("HTTP extra mismatch")
    if "fastapi==0.139.2" in requirements or "httpx2==2.7.0" not in extras["dev"]:
        failures.append("optional HTTP dependency isolation mismatch")
    if any(
        "uvicorn" in value.casefold() or "gunicorn" in value.casefold()
        for value in all_direct
    ):
        failures.append("production server dependency declared")
    requirement_file = tuple(
        line.strip()
        for line in _read("requirements-dev.txt").splitlines()
        if line.strip()
    )
    if set(requirement_file) != set(requirements) | set(extras["dev"]):
        failures.append("requirements-dev and project dependency groups differ")
    if "scripts" in project or "entry-points" in project:
        failures.append("executable or plugin entry point declared")


def _verify_license(failures: list[str]) -> None:
    normalized = (ROOT / "LICENSE").read_bytes().replace(b"\r\n", b"\n").strip(
        b"\n"
    ) + b"\n"
    if hashlib.sha256(normalized).hexdigest() != LICENSE_SHA256:
        failures.append("LICENSE differs from governed Apache-2.0 text")


def _verify_public_api(failures: list[str]) -> None:
    manifest = _assignment("tests/contracts/_api_manifest.py", "PUBLIC_API_EXPORTS")
    if sum(len(symbols) for symbols in manifest.values()) != 165:
        failures.append("public API manifest count changed without approval")
    for package_name, expected in manifest.items():
        parts = package_name.split(".")
        if len(parts) == 1:
            path = "cpmoakb/__init__.py"
        else:
            candidate = ROOT.joinpath(*parts)
            path = (
                str(candidate.relative_to(ROOT) / "__init__.py")
                if candidate.is_dir()
                else str(candidate.relative_to(ROOT).with_suffix(".py"))
            )
        try:
            actual = tuple(_assignment(path.replace("\\", "/"), "__all__"))
        except ReleaseReadinessError:
            failures.append(f"public package lacks static __all__: {package_name}")
            continue
        if actual != tuple(expected):
            failures.append(f"public API manifest mismatch: {package_name}")


def _tracked_files() -> tuple[str, ...]:
    try:
        result = subprocess.run(
            ["git", "ls-files", "-z"],
            cwd=ROOT,
            check=True,
            capture_output=True,
        )
    except (OSError, subprocess.CalledProcessError) as error:
        raise ReleaseReadinessError("unable to inspect tracked file policy") from error
    return tuple(
        sorted(value for value in result.stdout.decode("utf-8").split("\0") if value)
    )


def _verify_tracked_files(failures: list[str]) -> None:
    for name in _tracked_files():
        path = Path(name)
        lowered = name.casefold()
        parts = {part.casefold() for part in path.parts}
        if parts.intersection(
            {
                "__pycache__",
                ".mypy_cache",
                ".pytest_cache",
                ".ruff_cache",
                ".venv",
                "dist",
                "build",
            }
        ) or any(part.endswith(".egg-info") for part in parts):
            failures.append(f"tracked generated/cache path: {name}")
        if lowered.endswith((".db", ".sqlite", ".sqlite3", ".pyc", ".pyo")):
            failures.append(f"tracked generated artifact: {name}")
        if lowered.endswith(
            (".doc", ".docx", ".pdf", ".ppt", ".pptx", ".xls", ".xlsx", ".zip")
        ):
            failures.append(f"tracked official/publication file type: {name}")
        if lowered.endswith(".csv") and name not in ALLOWED_FROZEN_CSV:
            failures.append(f"unapproved tracked CSV: {name}")
        if path.name.casefold() in {
            ".env",
            ".npmrc",
            ".pypirc",
            "credentials",
            "credentials.json",
            "secrets.json",
        }:
            failures.append(f"tracked sensitive/local configuration: {name}")
        if lowered.endswith((".pem", ".key", ".p12", ".pfx")):
            failures.append(f"tracked private-key material pattern: {name}")


def _verify_workflow(failures: list[str]) -> None:
    workflow = _read(".github/workflows/ci.yml")
    if "permissions:\n  contents: read" not in workflow or re.search(
        r"permissions:\s*write", workflow
    ):
        failures.append("workflow permissions are not minimal read-only")
    for prohibited in (
        "pull_request_target",
        "${{ secrets.",
        "id-token: write",
        "packages: write",
        "curl |",
        "wget |",
        "pypi",
        "twine",
        "gh release",
        "git tag",
    ):
        if prohibited.casefold() in workflow.casefold():
            failures.append(f"prohibited workflow behavior: {prohibited}")
    found = re.findall(r"uses:\s*([^@\s]+)@([0-9a-f]{40})\s+#\s*(v\d+)", workflow)
    if {name: (sha, version) for name, sha, version in found} != ACTION_PINS:
        failures.append("GitHub Actions are not pinned to governed immutable SHAs")
    if workflow.count("persist-credentials: false") != workflow.count(
        "actions/checkout@"
    ):
        failures.append("checkout credentials persistence policy mismatch")


def _verify_readiness_manifest(failures: list[str], versions: dict[str, str]) -> None:
    manifest = json.loads(_read("release/release-readiness.json"))
    if manifest["package"]["version"] != versions["package"]:
        failures.append("release manifest package version mismatch")
    if manifest["contracts"] != {
        key: versions[key] for key in versions if key != "package"
    }:
        failures.append("release manifest contract versions mismatch")
    if manifest["publication"] != {
        "github_release_created": False,
        "pypi_published": False,
        "release_tag_created": False,
        "explicit_final_approval_required": True,
    }:
        failures.append("release publication status is not safely deferred")


def verify(dist_dir: Path | None = None) -> tuple[str, ...]:
    """Verify static repository evidence and optionally built artifacts."""

    failures = _failures()
    for relative in REQUIRED_DOCUMENTS:
        if not (ROOT / relative).is_file():
            failures.append(f"missing required security/release document: {relative}")
    versions = authoritative_versions()
    if versions != EXPECTED_VERSIONS:
        failures.append("authoritative package or contract version changed")
    _verify_metadata(failures)
    _verify_license(failures)
    _verify_public_api(failures)
    _verify_tracked_files(failures)
    _verify_workflow(failures)
    _verify_readiness_manifest(failures, versions)
    try:
        verify_security()
    except RuntimeError as error:
        failures.append(str(error))
    if dist_dir is not None:
        try:
            verify_distribution(dist_dir)
        except RuntimeError as error:
            failures.append(str(error))
    if failures:
        raise ReleaseReadinessError(
            "release-readiness violations:\n" + "\n".join(sorted(failures))
        )
    return tuple(REQUIRED_DOCUMENTS)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist-dir", type=Path)
    arguments = parser.parse_args()
    documents = verify(arguments.dist_dir)
    print(f"release readiness verified: {len(documents)} required evidence files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

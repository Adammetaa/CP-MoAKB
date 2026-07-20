"""Deterministically verify the prepared, unpublished release candidate.

Subprocesses are limited to development evidence: tracked-file/status inspection
and the existing offline installation verifier in artifact mode. Runtime code is
not involved and no shell, network, tag, release, upload, or publication occurs.
"""

from __future__ import annotations

import argparse
import ast
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.verify_distribution import verify as verify_distribution  # noqa: E402
from scripts.verify_documentation import (  # noqa: E402
    governed_markdown,
    verify as verify_documentation,
)
from scripts.verify_examples import verify as verify_examples  # noqa: E402
from scripts.verify_release_readiness import (  # noqa: E402
    EXPECTED_VERSIONS,
    authoritative_versions,
    verify as verify_readiness,
)
from scripts.verify_security_contract import verify as verify_security  # noqa: E402

MANIFEST_PATH = ROOT / "docs" / "release" / "release-candidate-manifest.json"
BASELINE_COMMIT = "8b5d7a3473d02c6ab796046f8d761e8aa95227eb"
PROHIBITED_PUBLICATION_SUFFIXES = (
    ".doc",
    ".docx",
    ".pdf",
    ".ppt",
    ".pptx",
    ".xls",
    ".xlsx",
    ".zip",
)
REQUIRED_RELEASE_DOCUMENTS = (
    "CHANGELOG.md",
    "docs/release/open-source-release-audit.md",
    "docs/release/release-candidate-checklist.md",
    "docs/release/release-notes-0.1.0.md",
    "docs/release/license-and-attribution-audit.md",
    "docs/release/github-release-draft.md",
    "docs/release/publication-runbook.md",
    "docs/runtime/specifications/RAS-015-open-source-release-audit-and-publication-boundary-contract.md",
    "references/IRAC/retrieval.md",
)


class ReleaseCandidateError(RuntimeError):
    """Release-candidate evidence violates RAS-015."""


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
                    break
                return ast.literal_eval(node.value)
    raise ReleaseCandidateError(f"missing static assignment: {relative}:{name}")


def _tracked_files() -> tuple[str, ...]:
    result = subprocess.run(
        ["git", "ls-files", "-z"],
        cwd=ROOT,
        check=True,
        capture_output=True,
    )
    return tuple(sorted(filter(None, result.stdout.decode("utf-8").split("\0"))))


def _manifest_failures() -> list[str]:
    failures: list[str] = []
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    versions = authoritative_versions()
    expected_package = {
        "distribution": "cp-moakb",
        "import_package": "cpmoakb",
        "version": versions["package"],
        "supported_python": ">=3.11,<3.13",
        "license": "Apache-2.0",
    }
    if manifest.get("schema") != "cpmoakb-release-candidate":
        failures.append("release-candidate manifest schema mismatch")
    if manifest.get("schema_version") != "1.0":
        failures.append("release-candidate manifest schema version mismatch")
    if manifest.get("baseline_commit") != BASELINE_COMMIT:
        failures.append("audited baseline commit mismatch")
    if manifest.get("release_identity") != "initial-open-source-release-candidate":
        failures.append("release identity mismatch")
    if manifest.get("package") != expected_package:
        failures.append("package identity mismatch")
    if manifest.get("contracts") != {
        key: versions[key] for key in versions if key != "package"
    }:
        failures.append("contract version mismatch")
    public_manifest = _assignment(
        "tests/contracts/_api_manifest.py", "PUBLIC_API_EXPORTS"
    )
    public_count = sum(len(symbols) for symbols in public_manifest.values())
    if (
        manifest.get("public_api_manifest_entries") != public_count
        or public_count != 165
    ):
        failures.append("public API manifest count mismatch")
    if manifest.get("governed_markdown_documents") != len(governed_markdown()):
        failures.append("governed documentation count mismatch")
    examples = json.loads(_read("examples/examples.json"))
    if manifest.get("examples") != {
        "executable": len(examples["examples"]),
        "documentation_only": len(examples["documentation_only"]),
    }:
        failures.append("example count mismatch")
    if manifest.get("publication_status") != "not_published":
        failures.append("publication status must remain not_published")
    approvals = manifest.get("approval_required_actions", [])
    if len(approvals) != 6 or len(set(approvals)) != 6:
        failures.append("six distinct approval actions are required")
    return failures


def _reference_failures(tracked: tuple[str, ...]) -> list[str]:
    failures: list[str] = []
    for name in tracked:
        if name.casefold().endswith(PROHIBITED_PUBLICATION_SUFFIXES):
            failures.append(f"tracked official/publication file type: {name}")
    manifest = _read("data/official/IRAC/source_manifest.yaml")
    identity = _read("tests/golden/irac_v11_5/source_identity.yaml")
    retrieval = _read("references/IRAC/retrieval.md")
    required = (
        "74641b0f56bcfb46574fd0dc815ee136170af66385950ad61045a0692ea750d6",
        "1480259",
        "IRAC_MoA_Classification_v11.5_2026.pdf",
    )
    if any(value not in manifest or value not in identity for value in required):
        failures.append("IRAC manifest and golden identity disagree")
    if any(value not in retrieval for value in required):
        failures.append("IRAC retrieval documentation disagrees with authority")
    if 'redistribution_status: "prohibited_without_verified_rights"' not in manifest:
        failures.append("IRAC redistribution boundary missing")
    counts = _read("tests/golden/irac_v11_5/expected_counts.yaml")
    hierarchy = json.loads(_read("tests/golden/irac_v11_5/expected_hierarchy.json"))
    expected_count = sum(1 for node in hierarchy["nodes"] if node["level"] in {1, 2, 3})
    if "total_nodes: 376" not in counts or expected_count != 376:
        failures.append("IRAC deterministic golden expectations mismatch")
    return failures


def _claim_failures() -> list[str]:
    failures: list[str] = []
    texts = "\n".join(_read(name).casefold() for name in REQUIRED_RELEASE_DOCUMENTS)
    for prohibited in (
        "package is published",
        "cp-moakb is production-ready",
        "provides agricultural diagnosis",
        "provides agricultural recommendations",
        "release tag created",
        "github release created",
        "pypi published",
    ):
        if prohibited in texts:
            failures.append(f"prohibited release claim: {prohibited}")
    for required in ("not_published", "not published", "explicit", "owner"):
        if required not in texts:
            failures.append(f"missing release boundary claim: {required}")
    return failures


def _verify_clean() -> None:
    result = subprocess.run(
        ["git", "status", "--porcelain", "--untracked-files=all"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    if result.stdout:
        raise ReleaseCandidateError("repository worktree is not clean")


def _verify_installation(dist_dir: Path) -> None:
    result = subprocess.run(
        [
            sys.executable,
            str(ROOT / "scripts" / "verify_installation.py"),
            "--dist-dir",
            str(dist_dir.resolve()),
        ],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise ReleaseCandidateError(
            "offline clean-room installation verification failed"
        )


def verify(
    dist_dir: Path | None = None,
    *,
    require_clean: bool = False,
    orchestrate: bool = True,
) -> tuple[str, ...]:
    """Verify static evidence and optionally artifact/installation evidence."""

    failures: list[str] = []
    for relative in REQUIRED_RELEASE_DOCUMENTS:
        if not (ROOT / relative).is_file():
            failures.append(f"missing release document: {relative}")
    tracked = _tracked_files()
    failures.extend(_manifest_failures())
    failures.extend(_reference_failures(tracked))
    failures.extend(_claim_failures())
    if authoritative_versions() != EXPECTED_VERSIONS:
        failures.append("authoritative version set changed")
    if orchestrate:
        try:
            verify_security()
            verify_readiness(dist_dir)
            verify_documentation()
            verify_examples()
        except RuntimeError as error:
            failures.append(str(error))
    if dist_dir is not None:
        try:
            verify_distribution(dist_dir)
            _verify_installation(dist_dir)
        except RuntimeError as error:
            failures.append(str(error))
    if failures:
        raise ReleaseCandidateError(
            "release-candidate violations:\n" + "\n".join(sorted(set(failures)))
        )
    if require_clean:
        _verify_clean()
    return REQUIRED_RELEASE_DOCUMENTS


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist-dir", type=Path)
    parser.add_argument("--require-clean", action="store_true")
    arguments = parser.parse_args()
    documents = verify(arguments.dist_dir, require_clean=arguments.require_clean)
    print(
        "release candidate verified: "
        f"{len(documents)} documents, status=not_published"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

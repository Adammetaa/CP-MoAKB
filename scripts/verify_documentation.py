"""Verify governed documentation structure, links, claims, and authorities."""

from __future__ import annotations

import ast
import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from scripts.verify_release_readiness import authoritative_versions  # noqa: E402

GROUPS = {
    "getting-started": (
        "quick-start.md",
        "installation.md",
        "first-query.md",
        "first-explanation.md",
        "http-integration.md",
        "cli-integration.md",
        "verification.md",
    ),
    "architecture": (
        "README.md",
        "system-overview.md",
        "layers.md",
        "runtime-flow.md",
        "dependency-direction.md",
        "data-and-control-boundaries.md",
        "error-boundaries.md",
        "security-boundaries.md",
        "version-boundaries.md",
        "extension-boundaries.md",
    ),
    "api": (
        "README.md",
        "runtime-api.md",
        "application-api.md",
        "composition-api.md",
        "serialization-api.md",
        "http-api.md",
        "cli-api.md",
        "versioning-and-compatibility.md",
        "public-symbols.md",
    ),
    "contributing": (
        "README.md",
        "development-setup.md",
        "testing.md",
        "documentation.md",
        "architecture-changes.md",
        "adding-a-parser.md",
        "adding-validation.md",
        "adding-a-transport.md",
        "adding-tests.md",
        "adr-and-ras-process.md",
        "pull-request-review.md",
    ),
    "maintainers": (
        "README.md",
        "project-doctrine.md",
        "design-freeze.md",
        "version-policy.md",
        "compatibility-policy.md",
        "review-checklist.md",
        "rejection-checklist.md",
        "release-process.md",
        "hotfix-and-rollback.md",
        "knowledge-transfer.md",
        "governance-boundaries.md",
    ),
    "governance": (
        "README.md",
        "decision-map.md",
        "contract-map.md",
        "traceability-map.md",
        "change-classification.md",
    ),
    "concepts": (
        "README.md",
        "observation-evidence-knowledge.md",
        "explanation.md",
        "determinism.md",
        "authority-and-provenance.md",
        "lifecycle.md",
        "unknown-and-unavailable.md",
        "platform-not-diagnosis.md",
    ),
    "project": (
        "README.md",
        "mission-and-scope.md",
        "philosophy.md",
        "current-capabilities.md",
        "non-goals.md",
        "faq.md",
        "roadmap.md",
        "future-vision.md",
    ),
    "release": (
        "README.md",
        "release-handbook.md",
        "release-candidate-process.md",
        "versioning.md",
        "artifacts.md",
        "release-notes-guide.md",
        "patch-and-hotfix.md",
        "rollback.md",
        "publication-boundary.md",
        "release-readiness-checklist.md",
        "compatibility-audit.md",
        "open-source-release-audit.md",
        "release-candidate-checklist.md",
        "release-notes-0.1.0.md",
        "license-and-attribution-audit.md",
        "github-release-draft.md",
        "publication-runbook.md",
    ),
    "security": (
        "README.md",
        "security-model.md",
        "threat-model.md",
        "dependency-policy.md",
        "release-security-checklist.md",
    ),
}
REQUIRED_DOCUMENTS = (
    "README.md",
    "CHANGELOG.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
    "docs/README.md",
    "docs/glossary.md",
    "examples/README.md",
    "references/IRAC/retrieval.md",
    "docs/runtime/specifications/RAS-014-documentation-developer-experience-and-knowledge-transfer-contract.md",
    "docs/runtime/specifications/RAS-015-open-source-release-audit-and-publication-boundary-contract.md",
) + tuple(f"docs/{group}/{name}" for group, names in GROUPS.items() for name in names)
LINK_PATTERN = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")
MACHINE_PATTERNS = (
    re.compile(r"(?i)\b[A-Z]:\\"),
    re.compile(r"/(?:home|Users)/[^/\s]+/"),
    re.compile(r"(?i)\bvip19\b"),
    re.compile(r"/actions/runs/\d+"),
)
PLACEHOLDER_PATTERN = re.compile(r"\b(?:TODO|TBD|FIXME|CHANGEME)\b")
VERSION_DOCUMENTS = {
    "docs/getting-started/installation.md": ("0.1.0", ">=3.11,<3.13"),
    "docs/api/runtime-api.md": ("0.1",),
    "docs/api/application-api.md": ("0.1",),
    "docs/api/composition-api.md": ("0.1",),
    "docs/api/serialization-api.md": ("1.0",),
    "docs/api/http-api.md": ("0.1",),
    "docs/api/cli-api.md": ("0.1",),
}
UNSUPPORTED_CLAIMS = (
    "cp-moakb is published on pypi",
    "cp-moakb is production-ready",
    "cp-moakb provides agricultural diagnosis",
    "cp-moakb provides agricultural recommendations",
    "cp-moakb provides ranking",
    "cp-moakb provides confidence scoring",
    "cp-moakb includes real agricultural data",
    "cp-moakb includes a production server",
)


class DocumentationVerificationError(RuntimeError):
    """Governed documentation violates RAS-014."""


def governed_markdown() -> tuple[Path, ...]:
    paths = {ROOT / name for name in REQUIRED_DOCUMENTS}
    paths.update((ROOT / "docs").rglob("*.md"))
    paths.update((ROOT / "examples").rglob("README.md"))
    return tuple(sorted(paths, key=lambda path: path.relative_to(ROOT).as_posix()))


def _links(path: Path, text: str) -> tuple[str, ...]:
    failures: list[str] = []
    for raw_target in LINK_PATTERN.findall(text):
        target = raw_target.strip().split(maxsplit=1)[0].strip("<>")
        if target.startswith(("http://", "https://", "mailto:", "#")):
            continue
        relative = unquote(target.split("#", 1)[0])
        if not relative:
            continue
        resolved = (path.parent / relative).resolve()
        try:
            resolved.relative_to(ROOT)
        except ValueError:
            failures.append(
                f"link leaves repository: {path.relative_to(ROOT).as_posix()} -> {target}"
            )
            continue
        if not resolved.exists():
            failures.append(
                f"broken link: {path.relative_to(ROOT).as_posix()} -> {target}"
            )
    return tuple(failures)


def _manifest_packages() -> tuple[str, ...]:
    path = ROOT / "tests" / "contracts" / "_api_manifest.py"
    tree = ast.parse(path.read_text(encoding="utf-8"))
    for node in tree.body:
        if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            if node.target.id == "PUBLIC_API_EXPORTS" and node.value is not None:
                value = ast.literal_eval(node.value)
                return tuple(value)
    raise DocumentationVerificationError("public API manifest is not static")


def verify() -> tuple[Path, ...]:
    failures: list[str] = []
    paths = governed_markdown()
    for relative in REQUIRED_DOCUMENTS:
        if not (ROOT / relative).is_file():
            failures.append(f"missing required document: {relative}")
    for path in paths:
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        name = path.relative_to(ROOT).as_posix()
        if len(text.strip()) < 120:
            failures.append(f"empty or ceremonial document: {name}")
        failures.extend(_links(path, text))
        if any(pattern.search(text) for pattern in MACHINE_PATTERNS):
            failures.append(f"machine-specific content: {name}")
        if PLACEHOLDER_PATTERN.search(text) or "example.com" in text:
            failures.append(f"placeholder content: {name}")
        lowered_text = text.casefold()
        for claim in UNSUPPORTED_CLAIMS:
            if claim in lowered_text:
                failures.append(
                    f"unsupported capability/publication claim in {name}: {claim}"
                )
    versions = authoritative_versions()
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    required_version_text = (
        versions["package"],
        versions["runtime"],
        versions["yaml"],
        versions["projection"],
        versions["application"],
        versions["http"],
        versions["cli"],
        versions["composition"],
        ">=3.11,<3.13",
        "Apache-2.0",
    )
    if any(value not in readme for value in required_version_text):
        failures.append("README version, Python, or license summary mismatch")
    for relative, expected_values in VERSION_DOCUMENTS.items():
        text = (ROOT / relative).read_text(encoding="utf-8")
        if any(value not in text for value in expected_values):
            failures.append(f"version documentation mismatch: {relative}")
    http_doc = (ROOT / "docs" / "api" / "http-api.md").read_text(encoding="utf-8")
    for route in (
        "GET | `/health`",
        "POST | `/v1/query`",
        "POST | `/v1/query-and-explain`",
        "GET | `/openapi.json`",
    ):
        if route not in http_doc:
            failures.append(f"HTTP route documentation mismatch: {route}")
    cli_doc = (ROOT / "docs" / "api" / "cli-api.md").read_text(encoding="utf-8")
    if "exactly `version`, `query`, and `query-and-explain`" not in cli_doc:
        failures.append("CLI command documentation mismatch")
    symbols_doc = (ROOT / "docs" / "api" / "public-symbols.md").read_text(
        encoding="utf-8"
    )
    for package in _manifest_packages():
        if f"`{package}`" not in symbols_doc:
            failures.append(f"public package missing from API handbook: {package}")
    ras_index = (ROOT / "docs" / "runtime" / "specifications" / "README.md").read_text(
        encoding="utf-8"
    )
    for number in range(1, 15):
        if f"RAS-{number:03d}" not in ras_index:
            failures.append(f"RAS index missing RAS-{number:03d}")
    if "RAS-015" not in ras_index:
        failures.append("RAS index missing RAS-015")
    release_manifest = (
        ROOT / "docs/release/release-candidate-manifest.json"
    ).read_text(encoding="utf-8")
    if '"publication_status": "not_published"' not in release_manifest:
        failures.append("release candidate publication status mismatch")
    release_documents = tuple(
        ROOT / name
        for name in (
            "CHANGELOG.md",
            "docs/release/open-source-release-audit.md",
            "docs/release/release-candidate-checklist.md",
            "docs/release/release-notes-0.1.0.md",
            "docs/release/license-and-attribution-audit.md",
            "docs/release/github-release-draft.md",
            "docs/release/publication-runbook.md",
        )
    )
    release_text = "\n".join(
        path.read_text(encoding="utf-8") for path in release_documents
    )
    if (
        "not_published" not in release_text
        or "not published" not in release_text.casefold()
    ):
        failures.append("release documents do not preserve unpublished state")
    if "<owner-approved-tag>" not in release_text:
        failures.append("GitHub Release draft lost owner-approved tag boundary")
    if "Private vulnerability reporting" not in (ROOT / "SECURITY.md").read_text(
        encoding="utf-8"
    ):
        failures.append("security reporting authority mismatch")
    source_manifest = (ROOT / "data/official/IRAC/source_manifest.yaml").read_text(
        encoding="utf-8"
    )
    retrieval = (ROOT / "references/IRAC/retrieval.md").read_text(encoding="utf-8")
    checksum = "74641b0f56bcfb46574fd0dc815ee136170af66385950ad61045a0692ea750d6"
    if checksum not in source_manifest or checksum not in retrieval:
        failures.append("IRAC retrieval checksum authority mismatch")
    if (
        'redistribution_status: "prohibited_without_verified_rights"'
        not in source_manifest
    ):
        failures.append("official-reference redistribution boundary mismatch")
    if failures:
        raise DocumentationVerificationError(
            "documentation verification failures:\n" + "\n".join(sorted(set(failures)))
        )
    return paths


def main() -> int:
    paths = verify()
    print(f"documentation verified: {len(paths)} governed Markdown files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

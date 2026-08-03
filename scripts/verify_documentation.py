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
    "knowledge": (
        "README.md",
        "KAS-001-knowledge-authoring-principles.md",
        "KAS-002-knowledge-record-standard.md",
        "KAS-003-evidence-standard.md",
        "KAS-004-citation-standard.md",
        "KAS-005-terminology-standard.md",
        "KAS-006-relationship-standard.md",
        "KAS-007-knowledge-lifecycle.md",
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
KNOWLEDGE_GOVERNANCE_DOCUMENTS = (
    "docs/knowledge/constitution/README.md",
    "docs/knowledge/constitution/knowledge-constitution.md",
    "docs/knowledge/roadmap/knowledge-engineering-roadmap.md",
)
KNOWLEDGE_GOVERNANCE_STANDARDS = (
    "docs/knowledge/governance/README.md",
    "docs/knowledge/governance/KGS-001-knowledge-governance-model.md",
    "docs/knowledge/governance/KGS-002-roles-and-responsibilities.md",
    "docs/knowledge/governance/KGS-003-review-process.md",
    "docs/knowledge/governance/KGS-004-conflict-management.md",
    "docs/knowledge/governance/KGS-005-publication-governance.md",
    "docs/knowledge/governance/KGS-006-audit-and-transparency.md",
)
KNOWLEDGE_EXPLORER_DOCUMENTS = (
    "prototype/knowledge-explorer/README.md",
    "prototype/knowledge-explorer/docs/information-architecture.md",
    "prototype/knowledge-explorer/docs/personas.md",
    "prototype/knowledge-explorer/docs/wireframes.md",
    "prototype/knowledge-explorer/docs/design-system.md",
    "prototype/knowledge-explorer/docs/deployment.md",
    "prototype/knowledge-explorer/docs/localization-policy.md",
)
KNOWLEDGE_LAB_DOCUMENTS = (
    "prototype/knowledge-lab/README.md",
    "prototype/knowledge-lab/docs/information-architecture.md",
    "prototype/knowledge-lab/docs/interaction-model.md",
    "prototype/knowledge-lab/docs/prototype-boundaries.md",
    "prototype/knowledge-lab/docs/design-system.md",
    "prototype/knowledge-lab/docs/deployment.md",
)
KNOWLEDGE_EDITORIAL_DOCUMENTS = (
    "docs/knowledge/editorial/README.md",
    "docs/knowledge/editorial/knowledge-editorial-handbook.md",
    "docs/knowledge/editorial/workflows/source-intake-workflow.md",
    "docs/knowledge/editorial/workflows/evidence-extraction-workflow.md",
    "docs/knowledge/editorial/workflows/knowledge-candidate-workflow.md",
    "docs/knowledge/editorial/workflows/terminology-workflow.md",
    "docs/knowledge/editorial/workflows/relationship-workflow.md",
    "docs/knowledge/editorial/workflows/review-and-revision-workflow.md",
    "docs/knowledge/editorial/workflows/publication-readiness-workflow.md",
    "docs/knowledge/editorial/guides/writing-definitions.md",
    "docs/knowledge/editorial/guides/writing-scope-and-exclusions.md",
    "docs/knowledge/editorial/guides/handling-conflicting-evidence.md",
    "docs/knowledge/editorial/guides/handling-uncertainty-and-unknowns.md",
    "docs/knowledge/editorial/guides/multilingual-authoring.md",
    "docs/knowledge/editorial/guides/rights-and-redistribution-review.md",
    "docs/knowledge/editorial/guides/corrections-deprecation-and-supersession.md",
    "docs/knowledge/editorial/checklists/author-checklist.md",
    "docs/knowledge/editorial/checklists/scientific-review-checklist.md",
    "docs/knowledge/editorial/checklists/evidence-review-checklist.md",
    "docs/knowledge/editorial/checklists/terminology-review-checklist.md",
    "docs/knowledge/editorial/checklists/ontology-review-checklist.md",
    "docs/knowledge/editorial/checklists/governance-review-checklist.md",
    "docs/knowledge/editorial/checklists/publication-readiness-checklist.md",
    "docs/knowledge/editorial/examples/README.md",
    "docs/knowledge/editorial/examples/fictional-good-example.md",
    "docs/knowledge/editorial/examples/fictional-bad-example.md",
)
KNOWLEDGE_REVIEW_DOCUMENTS = (
    "docs/knowledge/review/README.md",
    "docs/knowledge/review/knowledge-review-framework.md",
    "docs/knowledge/review/review-types/scientific-review.md",
    "docs/knowledge/review/review-types/evidence-review.md",
    "docs/knowledge/review/review-types/terminology-review.md",
    "docs/knowledge/review/review-types/ontology-review.md",
    "docs/knowledge/review/review-types/governance-review.md",
    "docs/knowledge/review/review-types/rights-review.md",
    "docs/knowledge/review/review-types/publication-readiness-review.md",
    "docs/knowledge/review/decisions/finding-classification.md",
    "docs/knowledge/review/decisions/acceptance-criteria.md",
    "docs/knowledge/review/decisions/decision-record.md",
    "docs/knowledge/review/decisions/escalation-and-appeal.md",
    "docs/knowledge/review/decisions/emergency-correction-review.md",
    "docs/knowledge/review/competence/reviewer-competence-framework.md",
    "docs/knowledge/review/competence/independence-and-recusal.md",
    "docs/knowledge/review/competence/conflict-of-interest-declaration.md",
    "docs/knowledge/review/instruments/review-matrix.md",
    "docs/knowledge/review/instruments/finding-log.md",
    "docs/knowledge/review/instruments/evidence-package-checklist.md",
    "docs/knowledge/review/instruments/review-completion-record.md",
    "docs/knowledge/review/instruments/final-acceptance-gate.md",
    "docs/knowledge/review/examples/README.md",
    "docs/knowledge/review/examples/fictional-passing-review.md",
    "docs/knowledge/review/examples/fictional-blocked-review.md",
)
KNOWLEDGE_TEMPLATE_DOCUMENTS = (
    "docs/knowledge/templates/README.md",
    "docs/knowledge/templates/template-governance.md",
    "docs/knowledge/templates/authoring/source-nomination-template.md",
    "docs/knowledge/templates/authoring/evidence-item-template.md",
    "docs/knowledge/templates/authoring/concept-candidate-template.md",
    "docs/knowledge/templates/authoring/terminology-candidate-template.md",
    "docs/knowledge/templates/authoring/relationship-candidate-template.md",
    "docs/knowledge/templates/authoring/unresolved-issue-template.md",
    "docs/knowledge/templates/review/review-finding-template.md",
    "docs/knowledge/templates/review/review-decision-template.md",
    "docs/knowledge/templates/review/conflict-of-interest-template.md",
    "docs/knowledge/templates/review/review-completion-template.md",
    "docs/knowledge/templates/review/final-acceptance-template.md",
    "docs/knowledge/templates/lifecycle/correction-template.md",
    "docs/knowledge/templates/lifecycle/revision-template.md",
    "docs/knowledge/templates/lifecycle/deprecation-template.md",
    "docs/knowledge/templates/lifecycle/supersession-template.md",
    "docs/knowledge/templates/lifecycle/retirement-template.md",
    "docs/knowledge/templates/lifecycle/publication-readiness-template.md",
    "docs/knowledge/templates/packages/source-evidence-package-template.md",
    "docs/knowledge/templates/packages/candidate-review-package-template.md",
    "docs/knowledge/templates/packages/knowledge-release-package-template.md",
    "docs/knowledge/templates/examples/README.md",
    "docs/knowledge/templates/examples/fictional-complete-package.md",
    "docs/knowledge/templates/examples/fictional-incomplete-package.md",
)
KNOWLEDGE_WORKSPACE_DOCUMENTS = (
    "docs/knowledge/workspace/README.md",
    "docs/knowledge/workspace/knowledge-workspace-blueprint.md",
    "docs/knowledge/workspace/vision/workspace-vision.md",
    "docs/knowledge/workspace/vision/explorer-and-lab-boundary.md",
    "docs/knowledge/workspace/vision/design-principles.md",
    "docs/knowledge/workspace/information-architecture/workspace-site-map.md",
    "docs/knowledge/workspace/information-architecture/queue-and-inbox-model.md",
    "docs/knowledge/workspace/information-architecture/object-navigation-model.md",
    "docs/knowledge/workspace/roles/role-based-workspaces.md",
    "docs/knowledge/workspace/roles/visibility-and-action-matrix.md",
    "docs/knowledge/workspace/roles/handoff-and-ownership-model.md",
    "docs/knowledge/workspace/workflows/end-to-end-knowledge-pipeline.md",
    "docs/knowledge/workspace/workflows/exception-and-lifecycle-journeys.md",
    "docs/knowledge/workspace/screens/screen-blueprints.md",
    "docs/knowledge/workspace/components/workspace-component-library.md",
    "docs/knowledge/workspace/components/status-and-lifecycle-components.md",
    "docs/knowledge/workspace/components/review-and-finding-components.md",
    "docs/knowledge/workspace/components/evidence-and-traceability-components.md",
    "docs/knowledge/workspace/collaboration/discussion-and-comment-model.md",
    "docs/knowledge/workspace/collaboration/revision-and-comparison-model.md",
    "docs/knowledge/workspace/collaboration/disagreement-and-conflict-model.md",
    "docs/knowledge/workspace/collaboration/notification-and-task-model.md",
    "docs/knowledge/workspace/governance/authority-and-permission-boundary.md",
    "docs/knowledge/workspace/governance/audit-and-retention-model.md",
    "docs/knowledge/workspace/governance/safety-and-non-inference-boundary.md",
    "docs/knowledge/workspace/governance/publication-boundary-integration.md",
    "docs/knowledge/workspace/wireframes/README.md",
    "docs/knowledge/workspace/wireframes/desktop-wireframes.md",
    "docs/knowledge/workspace/wireframes/tablet-wireframes.md",
    "docs/knowledge/workspace/wireframes/mobile-wireframes.md",
    "docs/knowledge/workspace/examples/README.md",
    "docs/knowledge/workspace/examples/fictional-author-journey.md",
    "docs/knowledge/workspace/examples/fictional-reviewer-journey.md",
)
REQUIRED_DOCUMENTS = (
    (
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
    )
    + KNOWLEDGE_GOVERNANCE_DOCUMENTS
    + KNOWLEDGE_GOVERNANCE_STANDARDS
    + KNOWLEDGE_EXPLORER_DOCUMENTS
    + KNOWLEDGE_LAB_DOCUMENTS
    + KNOWLEDGE_EDITORIAL_DOCUMENTS
    + KNOWLEDGE_REVIEW_DOCUMENTS
    + KNOWLEDGE_TEMPLATE_DOCUMENTS
    + KNOWLEDGE_WORKSPACE_DOCUMENTS
    + tuple(f"docs/{group}/{name}" for group, names in GROUPS.items() for name in names)
)
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
    kas_index = (ROOT / "docs" / "knowledge" / "README.md").read_text(encoding="utf-8")
    for number in range(1, 8):
        if f"KAS-{number:03d}" not in kas_index:
            failures.append(f"KAS index missing KAS-{number:03d}")
    kas_sections = (
        "## Purpose",
        "## Scope",
        "## Out of Scope",
        "## Normative Language",
        "## Definitions",
        "## Governance Rules",
        "## Examples",
        "## Non-examples",
        "## Reviewer Notes",
        "## Future Considerations",
    )
    for name in GROUPS["knowledge"][1:]:
        relative = f"docs/knowledge/{name}"
        text = (ROOT / relative).read_text(encoding="utf-8")
        if "Status: Active" not in text or "Version: 1.0" not in text:
            failures.append(f"KAS status or version mismatch: {relative}")
        for section in kas_sections:
            if section not in text:
                failures.append(
                    f"KAS missing required section: {relative} -> {section}"
                )
    constitution = (
        ROOT / "docs/knowledge/constitution/knowledge-constitution.md"
    ).read_text(encoding="utf-8")
    for authority in (
        "ADR-005",
        "ADR-006",
        "ADR-007",
        "ADR-008",
        "ADR-009",
        "RAS-001 through RAS-015",
        "Design Freeze",
        "Source Policy",
        "Publication Boundary",
    ):
        if authority not in constitution:
            failures.append(f"Knowledge Constitution missing authority: {authority}")
    roadmap = (
        ROOT / "docs/knowledge/roadmap/knowledge-engineering-roadmap.md"
    ).read_text(encoding="utf-8")
    for number in range(32, 40):
        if f"Sprint-{number:03d}K" not in roadmap:
            failures.append(f"Knowledge roadmap missing Sprint-{number:03d}K")
    for phase in (
        "Governance work",
        "Authoring preparation",
        "Pilot knowledge authoring",
        "Domain population",
        "Future implementation mapping",
    ):
        if phase not in roadmap:
            failures.append(f"Knowledge roadmap missing phase: {phase}")
    kgs_index = (ROOT / "docs/knowledge/governance/README.md").read_text(
        encoding="utf-8"
    )
    for number in range(1, 7):
        if f"KGS-{number:03d}" not in kgs_index:
            failures.append(f"KGS index missing KGS-{number:03d}")
    kgs_sections = (
        "## Purpose",
        "## Scope",
        "## Out of Scope",
        "## Definitions",
        "## Normative Language",
        "## Governance Rules",
        "## Examples",
        "## Non-examples",
        "## Reviewer Notes",
        "## Future Work",
    )
    for relative in KNOWLEDGE_GOVERNANCE_STANDARDS[1:]:
        text = (ROOT / relative).read_text(encoding="utf-8")
        if "Status: Active" not in text or "Version: 1.0" not in text:
            failures.append(f"KGS status or version mismatch: {relative}")
        for section in kgs_sections:
            if section not in text:
                failures.append(
                    f"KGS missing required section: {relative} -> {section}"
                )
    editorial_sections = (
        "## Purpose",
        "## Scope",
        "## Out of Scope",
        "## Authority",
        "## Definitions",
        "## Responsibilities",
        "## Procedure",
        "## Required Inputs",
        "## Required Outputs",
        "## Review Points",
        "## Failure Modes",
        "## Examples",
        "## Non-examples",
        "## Escalation",
        "## Audit Requirements",
        "## Change Control",
        "## Future Considerations",
    )
    for relative in KNOWLEDGE_EDITORIAL_DOCUMENTS[1:23]:
        text = (ROOT / relative).read_text(encoding="utf-8")
        if "Status: Active" not in text or "Version: 1.0" not in text:
            failures.append(f"editorial status or version mismatch: {relative}")
        for section in editorial_sections:
            if section not in text:
                failures.append(
                    f"editorial document missing required section: {relative} -> {section}"
                )
    review_sections = (
        "## Purpose",
        "## Scope",
        "## Out of Scope",
        "## Authority",
        "## Definitions",
        "## Required Inputs",
        "## Procedure",
        "## Decision Rules",
        "## Responsibilities",
        "## Failure Modes",
        "## Escalation",
        "## Audit Requirements",
        "## Examples",
        "## Non-examples",
        "## Change Control",
        "## Future Considerations",
    )
    for relative in KNOWLEDGE_REVIEW_DOCUMENTS:
        text = (ROOT / relative).read_text(encoding="utf-8")
        if "Status:" not in text or "Version: 1.0" not in text:
            failures.append(f"review status or version mismatch: {relative}")
        for section in review_sections:
            if section not in text:
                failures.append(
                    f"review document missing required section: {relative} -> {section}"
                )
    template_sections = (
        "## Purpose",
        "## Scope",
        "## Out of Scope",
        "## Authority",
        "## When to Use",
        "## Who Completes It",
        "## Required Inputs",
        "## Template Fields",
        "## Completion Rules",
        "## Prohibited Content",
        "## Review Requirements",
        "## Failure Modes",
        "## Example",
        "## Non-example",
        "## Audit and Retention",
        "## Change Control",
    )
    for relative in KNOWLEDGE_TEMPLATE_DOCUMENTS:
        text = (ROOT / relative).read_text(encoding="utf-8")
        if "Status:" not in text or "Version: 1.0" not in text:
            failures.append(f"template status or version mismatch: {relative}")
        for section in template_sections:
            if section not in text:
                failures.append(
                    f"template document missing required section: {relative} -> {section}"
                )
    for relative in KNOWLEDGE_WORKSPACE_DOCUMENTS:
        text = (ROOT / relative).read_text(encoding="utf-8")
        if "Status:" not in text or "Version:" not in text:
            failures.append(f"workspace status or version missing: {relative}")
    workspace_blueprint = (ROOT / KNOWLEDGE_WORKSPACE_DOCUMENTS[1]).read_text(
        encoding="utf-8"
    )
    for boundary in (
        "Knowledge Lab",
        "Explorer",
        "Knowledge Constitution",
        "ADR-005 through ADR-009",
        "RAS-001 through RAS-015",
        "Design Freeze",
        "Publication Boundary",
        "No automatic inference",
        "Every arrow is a human-governed handoff",
    ):
        if boundary not in workspace_blueprint:
            failures.append(f"workspace blueprint missing boundary: {boundary}")
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

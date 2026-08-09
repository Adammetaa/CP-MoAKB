from __future__ import annotations

import json
import re
from pathlib import Path

from scripts.verify_documentation import verify
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS

ROOT = Path(__file__).parents[2]
EXPLORER = ROOT / "prototype" / "knowledge-explorer"
LAB = ROOT / "prototype" / "knowledge-lab"
WORKFLOW = ROOT / ".github" / "workflows" / "knowledge-explorer-pages.yml"
LAB_PAGES = (
    "index.html",
    "tasks.html",
    "inbox.html",
    "sources.html",
    "evidence.html",
    "candidates.html",
    "candidate-detail.html",
    "review-queue.html",
    "review-detail.html",
    "findings.html",
    "acceptance.html",
    "release-package.html",
    "audit.html",
    "governance.html",
    "components.html",
)
ACTION_PINS = {
    "actions/checkout": "df4cb1c069e1874edd31b4311f1884172cec0e10",
    "actions/configure-pages": "45bfe0192ca1faeb007ade9deae92b16b8254a0d",
    "actions/upload-pages-artifact": "fc324d3547104276b827a68afc52ff2a11cc49c9",
    "actions/deploy-pages": "cd2ce8fcbc39b97be8ca5fce6e763baed58fa128",
}


def _workflow() -> str:
    return WORKFLOW.read_text(encoding="utf-8")


def _build() -> str:
    return (EXPLORER / "scripts" / "build.mjs").read_text(encoding="utf-8")


def _verifier() -> str:
    return (EXPLORER / "scripts" / "verify-pages-artifact.mjs").read_text(
        encoding="utf-8"
    )


def test_workflow_integrates_lab_without_competing_pages_workflow() -> None:
    pages_workflows = tuple((ROOT / ".github" / "workflows").glob("*pages*.yml"))
    assert pages_workflows == (WORKFLOW,)
    workflow = _workflow()
    assert '"prototype/knowledge-explorer/**"' in workflow
    assert '"prototype/knowledge-lab/**"' in workflow
    assert "node scripts/verify-prototype.mjs" in workflow
    assert "node scripts/verify-localization.mjs" in workflow
    assert "Build Knowledge Lab standalone artifact" in workflow
    assert "Build and validate combined static preview" in workflow


def test_workflow_preserves_least_privilege_and_separate_deploy_job() -> None:
    workflow = _workflow()
    assert "permissions:\n  contents: read" in workflow
    assert (
        "permissions:\n      contents: read\n      pages: write\n      id-token: write"
        in workflow
    )
    assert "needs: build" in workflow
    assert "name: github-pages" in workflow
    assert "persist-credentials: false" in workflow
    assert "${{ secrets." not in workflow
    assert "packages: write" not in workflow


def test_only_official_actions_remain_immutably_pinned() -> None:
    found = dict(
        re.findall(r"uses:\s*([^@\s]+)@([0-9a-f]{40})\s+#\s*v\d+", _workflow())
    )
    assert found == ACTION_PINS
    assert not re.search(r"uses:\s*[^@\s]+@(?![0-9a-f]{40}\b)", _workflow())


def test_root_landing_links_both_prototypes_without_javascript() -> None:
    landing = (EXPLORER / "deployment" / "root-index.html").read_text(encoding="utf-8")
    assert '<html lang="th">' in landing
    assert 'href="knowledge-explorer/"' in landing
    assert 'href="knowledge-lab/"' in landing
    assert 'href="https://github.com/Adammetaa/CP-MoAKB"' in landing
    assert "สำหรับอ่านและสำรวจองค์ความรู้ที่ได้รับอนุมัติ" in landing
    assert "ต้นแบบพื้นที่สร้าง ตรวจ และพิจารณา Knowledge Candidate" in landing
    assert "ไม่ใช่ระบบ" in landing
    assert "ไม่ใช่คำวินิจฉัยหรือคำแนะนำ" in landing
    assert "<script" not in landing
    assert not re.search(r"http-equiv\s*=\s*['\"]refresh", landing, re.IGNORECASE)


def test_exact_combined_artifact_allowlist_contains_all_lab_pages() -> None:
    verifier = _verifier()
    assert "exactly 40 approved files" in verifier
    for page in LAB_PAGES:
        assert page in verifier
    for asset in (
        "knowledge-lab/deployment.json",
        "knowledge-lab/assets/app.js",
        "knowledge-lab/assets/styles.css",
        "knowledge-lab/assets/data/mock-workspace.json",
        "knowledge-lab/assets/i18n/th.json",
        "knowledge-lab/assets/i18n/en.json",
    ):
        assert asset in verifier


def test_artifact_verifier_rejects_source_debris_and_sensitive_material() -> None:
    verifier = _verifier()
    for boundary in (
        "repository source",
        "prohibited source or generated material",
        "package metadata",
        "PRIVATE KEY",
        "symbolic link",
        "prohibited local or sensitive text",
    ):
        assert boundary in verifier
    for prohibited in (
        "pdf",
        "csv",
        "sqlite",
        "map",
        "pyc",
        "yaml",
        "node[_]modules",
        "references",
    ):
        assert prohibited in verifier


def test_all_lab_pages_remain_noindex_and_boundary_labeled() -> None:
    for page in LAB_PAGES:
        text = (LAB / page).read_text(encoding="utf-8")
        assert '<meta name="robots" content="noindex,nofollow">' in text
        assert "data-prototype-boundary" in text
    build = _build()
    for boundary in (
        "Static prototype",
        "Fictional placeholder content",
        "No real permissions",
        "No workflow execution",
        "Candidate is not accepted knowledge",
        "Acceptance is not publication",
        "No diagnosis or recommendation",
    ):
        assert boundary in build


def test_robots_policy_blocks_lab_without_changing_explorer_rule() -> None:
    robots = (EXPLORER / "deployment" / "robots.txt").read_text(encoding="utf-8")
    assert "Allow: /CP-MoAKB/" in robots
    assert "Disallow: /CP-MoAKB/knowledge-explorer/" in robots
    assert "Disallow: /CP-MoAKB/knowledge-lab/" in robots


def test_lab_deployment_metadata_uses_workflow_commit_only() -> None:
    build = _build()
    workflow = _workflow()
    assert "process.env.DEPLOY_COMMIT" in build
    assert "DEPLOY_COMMIT=$GITHUB_SHA" in workflow
    assert 'prototype: "knowledge-lab"' in build
    assert "package_version: packageVersion" in build
    assert 'status: "fictional-placeholder"' in build
    lab_metadata_line = next(
        line
        for line in build.splitlines()
        if 'prototype: "knowledge-lab"' in line and "JSON.stringify" in line
    )
    assert "build_timestamp" not in lab_metadata_line
    verifier = _verifier()
    for key in ("commit", "deployment_mode", "package_version", "prototype", "status"):
        assert key in verifier


def test_combined_smoke_test_covers_both_subpaths_and_crosslinks() -> None:
    smoke = (EXPLORER / "scripts" / "smoke-test.mjs").read_text(encoding="utf-8")
    assert "knowledge-explorer/" in smoke
    assert "knowledge-lab/" in smoke
    assert "Combined repository-subpath smoke test passed" in smoke
    assert "data-role-switcher" in smoke
    assert 'data-language="en"' in smoke
    assert "Candidate is not accepted knowledge" in smoke
    assert "Acceptance is not publication" in smoke
    assert "release-package.html" in smoke
    assert "audit.html" in smoke


def test_mock_records_remain_fictional_and_domain_neutral() -> None:
    mock = json.loads(
        (LAB / "assets" / "data" / "mock-workspace.json").read_text(encoding="utf-8")
    )
    assert mock["meta"]["status"] == "fictional-placeholder"
    for name, records in mock.items():
        if name == "meta":
            continue
        assert all(record["status"] == "fictional-placeholder" for record in records)
    serialized = json.dumps(mock).casefold()
    for term in ("oryza", "zea mays", "pesticide", "fungicide", "insecticide"):
        assert term not in serialized


def test_no_local_paths_official_material_or_real_actions_are_deployed() -> None:
    verifier = _verifier()
    build = _build()
    app = (LAB / "assets" / "app.js").read_text(encoding="utf-8")
    assert "[A-Z]:" in verifier
    assert "file:" in verifier
    assert "localhost" in verifier
    assert "127" in verifier
    assert "pdf" in verifier and "references" in verifier
    assert "data-conceptual-action" in app
    assert "no state was changed or persisted" in app
    assert 'fetch("assets/i18n/th.json")' in app
    assert 'fetch("assets/i18n/en.json")' in app
    assert 'fetch("deployment.json")' not in app
    assert "GitHub Release" not in build


def test_deployment_documentation_covers_owner_controls() -> None:
    deployment = (LAB / "docs" / "deployment.md").read_text(encoding="utf-8")
    for requirement in (
        "Public Preview Purpose and URL",
        "Explorer Relationship",
        "Combined Artifact Composition",
        "Workflow Triggers and Architecture",
        "Deployment Metadata",
        "Indexing Policy",
        "Prototype Boundaries",
        "Local Preview and Verification",
        "Required GitHub Pages Setting",
        "Rollback and Disablement",
        "Prototype, Future Implementation, and Production",
    ):
        assert requirement in deployment
    assert "does not mean that URL is live" in deployment
    assert "This sprint does not push" in deployment


def test_documentation_api_and_engineering_contracts_are_unchanged() -> None:
    assert len(verify()) == 575
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165
    changed_scope = "\n".join(
        (
            _workflow(),
            _build(),
            _verifier(),
            (EXPLORER / "deployment" / "root-index.html").read_text(encoding="utf-8"),
            (LAB / "docs" / "deployment.md").read_text(encoding="utf-8"),
        )
    )
    assert "cpmoakb/" not in changed_scope
    assert "schema.sql" not in changed_scope

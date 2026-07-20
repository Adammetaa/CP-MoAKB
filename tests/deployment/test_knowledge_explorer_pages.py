from __future__ import annotations

import json
import re
from pathlib import Path

from tests.contracts._api_manifest import PUBLIC_API_EXPORTS

ROOT = Path(__file__).parents[2]
PROTOTYPE = ROOT / "prototype" / "knowledge-explorer"
WORKFLOW = ROOT / ".github" / "workflows" / "knowledge-explorer-pages.yml"
PAGES = (
    "index.html",
    "search.html",
    "browse.html",
    "concept.html",
    "evidence.html",
    "source.html",
    "authority.html",
    "governance.html",
    "about.html",
    "components.html",
)
ACTION_PINS = {
    "actions/checkout": ("df4cb1c069e1874edd31b4311f1884172cec0e10", "v6"),
    "actions/configure-pages": ("45bfe0192ca1faeb007ade9deae92b16b8254a0d", "v6"),
    "actions/upload-pages-artifact": (
        "fc324d3547104276b827a68afc52ff2a11cc49c9",
        "v5",
    ),
    "actions/deploy-pages": ("cd2ce8fcbc39b97be8ca5fce6e763baed58fa128", "v5"),
}


def _workflow() -> str:
    return WORKFLOW.read_text(encoding="utf-8")


def test_pages_workflow_exists_and_has_scoped_triggers() -> None:
    text = _workflow()

    assert "push:" in text
    assert "branches:\n      - main" in text
    assert '"prototype/knowledge-explorer/**"' in text
    assert "workflow_dispatch:" in text


def test_pages_workflow_uses_least_privilege_and_pages_environment() -> None:
    text = _workflow()

    assert "permissions:\n  contents: read" in text
    assert (
        "permissions:\n      contents: read\n      pages: write\n      id-token: write"
        in text
    )
    assert "name: github-pages" in text
    assert "url: ${{ steps.deployment.outputs.page_url }}" in text
    assert "${{ secrets." not in text
    assert "packages: write" not in text


def test_only_official_pages_actions_are_immutably_pinned() -> None:
    found = re.findall(r"uses:\s*([^@\s]+)@([0-9a-f]{40})\s+#\s*(v\d+)", _workflow())

    assert {name: (sha, version) for name, sha, version in found} == ACTION_PINS
    assert not re.search(r"uses:\s*[^@\s]+@(?![0-9a-f]{40}\b)", _workflow())


def test_workflow_builds_allowlisted_repository_subpath_artifact() -> None:
    text = _workflow()

    assert "node scripts/build.mjs" in text
    assert "node scripts/verify-pages-artifact.mjs dist/pages-root" in text
    assert "node scripts/smoke-test.mjs" in text
    assert "path: prototype/knowledge-explorer/dist/pages-root" in text
    assert "persist-credentials: false" in text


def test_required_pages_are_boundary_labeled_and_subpath_portable() -> None:
    for page in PAGES:
        text = (PROTOTYPE / page).read_text(encoding="utf-8")
        assert "Prototype · fictional placeholder content" in text
        assert '<meta name="robots" content="noindex,nofollow">' in text
        assert "C:\\" not in text
        assert "file://" not in text
        assert "localhost" not in text
        for target in re.findall(r'href="([^"]+)"', text):
            if target.startswith("https://") or target.startswith("#"):
                continue
            assert not target.startswith("/")
            assert ".." not in target


def test_root_landing_and_robots_policy_are_governed() -> None:
    landing = (PROTOTYPE / "deployment" / "root-index.html").read_text(encoding="utf-8")
    robots = (PROTOTYPE / "deployment" / "robots.txt").read_text(encoding="utf-8")

    assert 'href="knowledge-explorer/"' in landing
    assert "fictional placeholder content" in landing
    assert 'content="index,follow"' in landing
    assert "Disallow: /CP-MoAKB/knowledge-explorer/" in robots


def test_artifact_verifier_has_exact_allowlist_and_prohibited_capability_checks() -> (
    None
):
    verifier = (PROTOTYPE / "scripts" / "verify-pages-artifact.mjs").read_text(
        encoding="utf-8"
    )
    build = (PROTOTYPE / "scripts" / "build.mjs").read_text(encoding="utf-8")

    for page in PAGES:
        assert page in verifier
    for approved in (
        "knowledge-explorer/deployment.json",
        "knowledge-explorer/assets/app.js",
        "knowledge-explorer/assets/styles.css",
        "knowledge-explorer/assets/og.png",
        "knowledge-explorer/assets/data/mock-knowledge.json",
    ):
        assert approved in verifier
    for boundary in (
        "symbolic link",
        "PRIVATE KEY",
        "fictional-placeholder",
        "noindex,nofollow",
        "prohibited local or sensitive text",
    ):
        assert boundary in verifier
    for prohibited in (
        "localStorage",
        "sessionStorage",
        "WebSocket",
        "EventSource",
        "document.cookie",
        "analytics",
    ):
        assert prohibited in build


def test_deployment_metadata_uses_real_workflow_identity() -> None:
    build = (PROTOTYPE / "scripts" / "build.mjs").read_text(encoding="utf-8")
    app = (PROTOTYPE / "assets" / "app.js").read_text(encoding="utf-8")

    assert "process.env.DEPLOY_COMMIT" in build
    assert "/^[0-9a-f]{40}$/" in build
    assert "process.env.BUILD_TIMESTAMP" in build
    assert 'deployment_mode: "preview"' in build
    assert 'status: "fictional-placeholder"' in build
    assert 'fetch("deployment.json")' in app
    assert "GITHUB_SHA" in _workflow()


def test_mock_data_remains_fictional_and_api_manifest_unchanged() -> None:
    mock = json.loads(
        (PROTOTYPE / "assets" / "data" / "mock-knowledge.json").read_text(
            encoding="utf-8"
        )
    )

    assert mock["meta"]["status"] == "fictional-placeholder"
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165


def test_deployment_documentation_covers_owner_controls_and_rollback() -> None:
    deployment = (PROTOTYPE / "docs" / "deployment.md").read_text(encoding="utf-8")

    for requirement in (
        "public-preview architecture",
        "Workflow Triggers",
        "Artifact Boundary",
        "Deployment Identity",
        "Indexing Decision",
        "Local Validation",
        "Required GitHub Pages Setting",
        "Manual Deployment Procedure",
        "Rollback and Disablement",
        "Preview, Release, and Production",
        "How to Verify the Deployed Commit",
    ):
        assert requirement in deployment
    assert "Settings → Pages → Build and deployment → Source → GitHub Actions" in (
        deployment
    )
    assert "does not claim that GitHub Pages is enabled" in deployment

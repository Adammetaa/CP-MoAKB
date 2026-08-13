from __future__ import annotations

import json
import re
from typing import Any

from scripts.verify_documentation import KNOWLEDGE_LAB_DOCUMENTS, ROOT, verify
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS

PROTOTYPE = ROOT / "prototype" / "knowledge-lab"
PAGES = (
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
NAVIGATION = {
    "index.html": "แดชบอร์ด",
    "tasks.html": "งานของฉัน",
    "inbox.html": "กล่องรับงาน",
    "sources.html": "แหล่งข้อมูล",
    "evidence.html": "หลักฐาน",
    "candidates.html": "รายการผู้สมัคร",
    "review-queue.html": "คิวทบทวน",
    "findings.html": "ข้อค้นพบ",
    "acceptance.html": "เกณฑ์รับรอง",
    "release-package.html": "แพ็กเกจเผยแพร่",
    "audit.html": "ประวัติการตรวจสอบ",
    "governance.html": "ธรรมาภิบาล",
    "components.html": "คลังคอมโพเนนต์",
}


def _read(relative: str) -> str:
    return (PROTOTYPE / relative).read_text(encoding="utf-8")


def _data() -> dict[str, Any]:
    return json.loads(_read("assets/data/mock-workspace.json"))


def test_required_pages_and_documents_exist() -> None:
    assert len(PAGES) == 15
    for page in PAGES:
        assert (PROTOTYPE / page).is_file()
    assert len(KNOWLEDGE_LAB_DOCUMENTS) == 6
    for relative in KNOWLEDGE_LAB_DOCUMENTS:
        assert (ROOT / relative).is_file()


def test_every_page_is_thai_first_static_and_boundary_labeled() -> None:
    for page in PAGES:
        text = _read(page)
        assert '<html lang="th">' in text
        assert "<main" in text
        assert "data-page=" in text
        assert "data-prototype-boundary" in text
        assert '<meta name="robots" content="noindex,nofollow">' in text
        assert re.search(r"<h1[^>]*>.*[\u0E00-\u0E7F].*</h1>", text)
        main = re.search(r"<main[\s\S]*?</main>", text)
        assert main is not None
        assert len(main.group()) > 700


def test_every_page_contains_static_thai_navigation() -> None:
    for page in PAGES:
        text = _read(page)
        assert "การนำทางหลัก" in text
        for href, label in NAVIGATION.items():
            assert f'href="{href}"' in text
            assert label in text


def test_english_switching_and_paired_catalogs_exist() -> None:
    thai = json.loads(_read("assets/i18n/th.json"))
    english = json.loads(_read("assets/i18n/en.json"))
    assert thai["_meta"]["locale"] == "th"
    assert english["_meta"]["locale"] == "en"
    assert thai.keys() == english.keys()
    app = _read("assets/app.js")
    assert 'new Set(["th", "en"])' in app
    assert "applyLanguage" in app
    for page in PAGES:
        text = _read(page)
        assert 'data-language="th"' in text
        assert 'data-language="en"' in text


def test_mock_data_is_minimal_and_fictional_placeholder_only() -> None:
    data = _data()
    assert data["meta"]["status"] == "fictional-placeholder"
    assert "not agricultural knowledge" in data["meta"]["disclaimer"]
    expected = {
        "sourceCandidates": 1,
        "evidenceItems": 2,
        "claims": 1,
        "conceptCandidates": 1,
        "terminologyCandidates": 1,
        "relationshipCandidates": 1,
        "findings": 2,
        "reviewDecisions": 1,
        "acceptanceGates": 1,
        "releasePackages": 1,
    }
    for key, count in expected.items():
        assert len(data[key]) == count
        assert all(item["status"] == "fictional-placeholder" for item in data[key])
    assert len(data["auditEvents"]) >= 15
    assert all(
        item["status"] == "fictional-placeholder" for item in data["auditEvents"]
    )


def test_no_real_agricultural_terms_are_introduced() -> None:
    source = "\n".join(_read(page) for page in PAGES) + json.dumps(_data())
    lowered = source.casefold()
    for term in (
        "oryza",
        "zea mays",
        "pesticide",
        "fungicide",
        "insecticide",
        "herbicide",
    ):
        assert term not in lowered


def test_no_backend_persistence_or_external_runtime_dependency_exists() -> None:
    package = json.loads(_read("package.json"))
    assert package["private"] is True
    assert package["version"] == "0.0.0-private"
    assert "dependencies" not in package
    app = _read("assets/app.js")
    for prohibited in (
        "WebSocket",
        "EventSource",
        "indexedDB",
        "document.cookie",
        "XMLHttpRequest",
        "analytics",
    ):
        assert prohibited not in app
    assert "no backend" in _read("README.md").casefold()
    assert "workflow persistence" in _read("README.md").casefold()


def test_no_external_javascript_fonts_or_assets_exist() -> None:
    for page in PAGES:
        text = _read(page)
        assert not re.search(r'(?:src|href)="(?:https?:)?//', text)
    css = _read("assets/styles.css")
    assert "@import" not in css
    assert not re.search(r"url\s*\(", css)
    assert "external" not in _read("package.json").casefold()


def test_required_role_views_are_represented() -> None:
    source = _read("index.html")
    for role in (
        "Knowledge Author",
        "Scientific Reviewer",
        "Evidence Reviewer",
        "Terminology Reviewer",
        "Ontology Reviewer",
        "Governance Reviewer",
        "Release Editor",
        "Project Owner",
        "Read-only Observer",
    ):
        assert (
            f"<option>{role}</option>" in source
            or f"<option selected>{role}</option>" in source
        )
    assert "does not implement permissions" in _read("assets/app.js")


def test_required_finding_classes_are_textually_represented() -> None:
    findings = _read("findings.html")
    for finding_class in (
        "Blocking",
        "Major",
        "Minor",
        "Editorial",
        "Clarification Required",
        "Evidence Gap",
        "Conflict",
        "Out of Scope",
        "Rights Blocker",
        "Governance Blocker",
    ):
        assert finding_class in findings
    assert "สีไม่ใช่ตัวบ่งชี้เพียงอย่างเดียว" in findings


def test_acceptance_and_release_remain_separate_and_inert() -> None:
    acceptance = _read("acceptance.html")
    release = _read("release-package.html")
    assert "Acceptance is not publication" in acceptance
    assert "FAIL" in acceptance and "REVISION REQUIRED" in acceptance
    assert "BLOCKED" in acceptance
    assert "does not push, tag, release, deploy, or publish" in release
    assert "NOT_AUTHORIZED" in release
    assert "Git push" in release and "GitHub Release" in release


def test_traceability_and_version_comparison_are_visible() -> None:
    evidence = _read("evidence.html")
    candidate = _read("candidate-detail.html")
    for step in (
        "Candidate",
        "Claim",
        "Evidence",
        "Source",
        "Authority",
        "Review",
        "Decision",
    ):
        assert step in evidence
    for state in (
        "supports",
        "contradicts",
        "withdrawn",
        "rights constrained",
        "unresolved",
    ):
        assert state in evidence
    for comparison in (
        "Previous",
        "Current",
        "Author response",
        "Reviewer request",
        "Accepted change",
        "Rejected change",
        "Unresolved change",
    ):
        assert comparison.casefold() in candidate.casefold()


def test_internal_links_resolve_and_are_subpath_safe() -> None:
    for page in PAGES:
        text = _read(page)
        for target in re.findall(r'(?:href|src)="([^"]+)"', text):
            assert not target.startswith(("/", "http://", "https://", "//"))
            assert ".." not in target
            local = target.split("#", 1)[0].split("?", 1)[0]
            if not local:
                continue
            assert (PROTOTYPE / local).is_file(), f"{page}: {target}"


def test_accessibility_and_mobile_static_rules_exist() -> None:
    css = _read("assets/styles.css")
    for rule in (
        ":focus-visible",
        "min-height: 44px",
        "prefers-reduced-motion",
        "overflow-wrap",
        "@media (max-width: 760px)",
    ):
        assert rule in css
    for page in PAGES:
        text = _read(page)
        assert "skip-link" in text
        assert 'aria-label="การนำทางหลัก"' in text


def test_documentation_count_and_public_api_are_unchanged() -> None:
    assert len(verify()) == 681
    assert sum(len(exports) for exports in PUBLIC_API_EXPORTS.values()) == 165


def test_protected_engineering_boundaries_are_explicit_and_absent() -> None:
    boundaries = " ".join(_read("docs/prototype-boundaries.md").split())
    for term in (
        "Runtime behavior",
        "public API",
        "schema",
        "parser",
        "registry",
        "database table",
        "backend service",
        "authentication",
        "authorization",
        "workflow automation",
    ):
        assert term in boundaries
    prohibited_extensions = {".py", ".sql", ".yaml", ".yml"}
    assert not any(
        path.suffix in prohibited_extensions for path in PROTOTYPE.rglob("*")
    )

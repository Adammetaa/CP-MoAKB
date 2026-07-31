from __future__ import annotations

import json
import hashlib
import re
from pathlib import Path

from tests.contracts._api_manifest import PUBLIC_API_EXPORTS

ROOT = Path(__file__).parents[2]
PROTOTYPE = ROOT / "prototype" / "knowledge-explorer"
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
STATIC_NAVIGATION = {
    "index.html": "หน้าแรก",
    "search.html": "ค้นหา",
    "browse.html": "เรียกดู",
    "governance.html": "ธรรมาภิบาลองค์ความรู้",
    "about.html": "เกี่ยวกับโครงการ",
}


def _catalog(language: str) -> dict[str, object]:
    return json.loads(
        (PROTOTYPE / "assets" / "i18n" / f"{language}.json").read_text(encoding="utf-8")
    )


def _flatten(value: dict[str, object], prefix: str = "") -> dict[str, str]:
    flattened: dict[str, str] = {}
    for key, child in value.items():
        if not prefix and key == "_meta":
            continue
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(child, str):
            flattened[path] = child
        else:
            assert isinstance(child, dict)
            flattened.update(_flatten(child, path))
    return flattened


def _mock() -> dict[str, object]:
    return json.loads(
        (PROTOTYPE / "assets" / "data" / "mock-knowledge.json").read_text(
            encoding="utf-8"
        )
    )


def test_thai_is_the_default_language_on_every_page() -> None:
    for page in PAGES:
        assert '<html lang="th">' in (PROTOTYPE / page).read_text(encoding="utf-8")


def test_english_can_be_selected_and_document_language_updates() -> None:
    app = (PROTOTYPE / "assets" / "app.js").read_text(encoding="utf-8")
    assert 'data-language="en"' in app
    assert "applyDocumentLanguage(document.documentElement, language)" in app
    assert 'new Set(["th", "en"])' in app


def test_language_preference_persists_without_being_required() -> None:
    app = (PROTOTYPE / "assets" / "app.js").read_text(encoding="utf-8")
    assert "storage?.getItem(storageKey)" in app
    assert "storage?.setItem(storageKey, nextLanguage)" in app
    assert app.count("catch {") >= 2
    assert 'return "th"' in app


def test_every_page_exposes_shared_language_switcher_header() -> None:
    for page in PAGES:
        assert "data-site-header" in (PROTOTYPE / page).read_text(encoding="utf-8")
    app = (PROTOTYPE / "assets" / "app.js").read_text(encoding="utf-8")
    assert 'class="language-switcher"' in app
    assert 'data-language="th"' in app


def test_every_page_has_working_thai_static_navigation_before_javascript() -> None:
    for page in PAGES:
        text = (PROTOTYPE / page).read_text(encoding="utf-8")
        header = re.search(
            r"<header[^>]*data-site-header[^>]*>(.*?)</header>", text, re.DOTALL
        )
        assert header and header[1].strip()
        for href, label in STATIC_NAVIGATION.items():
            assert f'href="{href}"' in header[1]
            assert label in header[1]
        assert "CP-MoAKB" in header[1]
        assert "Knowledge Explorer" in header[1]
        assert "ไทย" in header[1] and "EN" in header[1]
        current_links = re.findall(r'<a[^>]*aria-current="page"[^>]*>', header[1])
        if page in STATIC_NAVIGATION:
            assert len(current_links) == 1
            assert f'href="{page}"' in current_links[0]
        else:
            assert not current_links
        for target in re.findall(r'href="([^"]+)"', header[1]):
            assert not target.startswith(("/", "http://", "https://"))
            assert ".." not in target
    app = (PROTOTYPE / "assets" / "app.js").read_text(encoding="utf-8")
    assert "header.innerHTML" in app


def test_critical_no_javascript_fallbacks_are_nonempty_and_fictional() -> None:
    required = {
        "index.html": ("data-stats", "data-latest-concepts", "data-latest-sources"),
        "search.html": ("data-results",),
        "concept.html": ("data-relationships",),
    }
    for page, attributes in required.items():
        text = (PROTOTYPE / page).read_text(encoding="utf-8")
        for attribute in attributes:
            match = re.search(
                rf"<([a-z0-9]+)[^>]*\b{attribute}\b[^>]*>(.*?)</\1>",
                text,
                re.DOTALL | re.IGNORECASE,
            )
            assert match and match[2].strip()
    home = (PROTOTYPE / "index.html").read_text(encoding="utf-8")
    search = (PROTOTYPE / "search.html").read_text(encoding="utf-8")
    concept = (PROTOTYPE / "concept.html").read_text(encoding="utf-8")
    assert "ข้อมูลสมมติ" in home and "ไม่ใช่คำวินิจฉัยหรือคำแนะนำ" in home
    assert "JavaScript" in search and "ไม่มีคำวินิจฉัยหรือคำแนะนำ" in search
    assert "ความสัมพันธ์สมมติ" in concept


def test_translation_catalogs_have_identical_complete_keys() -> None:
    assert _catalog("th")["_meta"] == {"schema_version": 1, "locale": "th"}
    assert _catalog("en")["_meta"] == {"schema_version": 1, "locale": "en"}
    thai = _flatten(_catalog("th"))
    english = _flatten(_catalog("en"))
    assert thai.keys() == english.keys()
    assert all(value.strip() for value in thai.values())
    assert all(value.strip() for value in english.values())


def test_all_markup_translation_keys_exist_in_both_catalogs() -> None:
    thai = _flatten(_catalog("th"))
    english = _flatten(_catalog("en"))
    for page in PAGES:
        text = (PROTOTYPE / page).read_text(encoding="utf-8")
        keys = re.findall(r'data-i18n(?:-placeholder|-aria-label)?="([^"]+)"', text)
        assert keys
        assert all(key in thai and key in english for key in keys)


def test_missing_keys_raise_instead_of_silently_falling_back() -> None:
    app = (PROTOTYPE / "assets" / "app.js").read_text(encoding="utf-8")
    assert "Missing ${locale} translation key: ${key}" in app
    assert "value[language] ?? value.en" in app


def test_metadata_is_thai_first_and_robots_policy_is_unchanged() -> None:
    for page in PAGES:
        text = (PROTOTYPE / page).read_text(encoding="utf-8")
        assert '<meta name="robots" content="noindex,nofollow">' in text
        assert re.search(r"[ก-๙]", re.search(r"<title>(.*?)</title>", text)[1])
        assert re.search(r'<meta name="description" content="[^"]*[ก-๙]', text)


def test_scientific_name_placeholder_is_not_translated() -> None:
    mock = _mock()
    assert mock["concepts"][0]["scientificName"] == (
        "Placeholder scientific name — not asserted"
    )
    concept = (PROTOTYPE / "concept.html").read_text(encoding="utf-8")
    assert 'lang="en" data-i18n="concept.scientificValue"' in concept


def test_standards_identifiers_are_unchanged() -> None:
    domains = _mock()["domains"]
    assert all(identifier in domains for identifier in ("IRAC", "FRAC", "HRAC", "BBCH"))


def test_every_mock_record_retains_fictional_placeholder_status() -> None:
    mock = _mock()
    assert mock["meta"]["status"] == "fictional-placeholder"
    for group in ("concepts", "evidence", "sources", "authorities"):
        assert all(
            record["status"] == "fictional-placeholder" for record in mock[group]
        )


def test_thai_and_english_search_terms_exist_in_same_static_records() -> None:
    serialized = json.dumps(_mock(), ensure_ascii=False).casefold()
    assert "แนวคิด" in serialized
    assert "placeholder concept" in serialized
    assert "หลักฐาน" in serialized
    assert "evidence" in serialized


def test_search_is_static_bilingual_and_has_localized_empty_state() -> None:
    app = (PROTOTYPE / "assets" / "app.js").read_text(encoding="utf-8")
    assert "JSON.stringify(item).toLocaleLowerCase()" in app
    assert 't("search.empty")' in app
    assert "searchKnowledge(knowledgeData, query, activeFilter)" in app
    assert "localizedResultCount(messages, language, items.length)" in app
    assert "fetch(" in app
    assert "XMLHttpRequest" not in app


def test_long_thai_component_and_mixed_language_examples_exist() -> None:
    components = (PROTOTYPE / "components.html").read_text(encoding="utf-8")
    assert "thai-stress" in components
    assert 'data-i18n="components.stressText"' in components
    assert "IRAC · FRAC · HRAC · BBCH" in components


def test_accessibility_labels_exist_in_both_languages() -> None:
    thai = _flatten(_catalog("th"))
    english = _flatten(_catalog("en"))
    for key in (
        "language.label",
        "language.thai",
        "language.english",
        "nav.primaryLabel",
        "search.filtersLabel",
        "concept.tabsLabel",
    ):
        assert thai[key]
        assert english[key]


def test_touch_targets_focus_and_reduced_motion_are_preserved() -> None:
    styles = (PROTOTYPE / "assets" / "styles.css").read_text(encoding="utf-8")
    assert "min-height: 44px" in styles
    assert ":focus-visible" in styles
    assert "prefers-reduced-motion: reduce" in styles


def test_no_external_localization_or_font_dependency_exists() -> None:
    styles = (PROTOTYPE / "assets" / "styles.css").read_text(encoding="utf-8")
    package = json.loads((PROTOTYPE / "package.json").read_text(encoding="utf-8"))
    assert "@import" not in styles
    assert "http://" not in styles and "https://" not in styles
    assert "dependencies" not in package


def test_prototype_notices_exist_in_both_languages() -> None:
    thai = _catalog("th")
    english = _catalog("en")
    assert "ต้นแบบ" in thai["prototype"]["notice"]
    assert "not diagnosis or recommendation" in english["prototype"]["notice"]


def test_localization_policy_separates_ui_from_knowledge_translation() -> None:
    policy = (PROTOTYPE / "docs" / "localization-policy.md").read_text(encoding="utf-8")
    for requirement in (
        "Thai-first user experience",
        "English preservation rules",
        "Scientific-name policy",
        "Thai and English dual-label policy",
        "Terminology uncertainty handling",
        "Prohibited invented translations",
        "Review responsibility",
        "UI localization versus knowledge translation",
        "does not make a term an accepted CP-MoAKB vocabulary term",
        "No translation in this sprint is authoritative agricultural knowledge",
    ):
        assert requirement in policy


def test_english_social_preview_exception_is_governed_and_asset_is_unchanged() -> None:
    policy = (PROTOTYPE / "docs" / "localization-policy.md").read_text(encoding="utf-8")
    for requirement in (
        "assets/og.png",
        "English CP-MoAKB",
        "does not make the interface English-first",
        "not authoritative terminology",
        "does not override Thai-first HTML",
        "separate product approval",
    ):
        assert requirement in policy
    digest = hashlib.sha256((PROTOTYPE / "assets" / "og.png").read_bytes()).hexdigest()
    assert digest == "d1eea3c5de4123cb52c3176795e524896c985bf621408bfca579f3f11659ebf0"


def test_artifact_allowlist_contains_only_approved_localization_files() -> None:
    verifier = (PROTOTYPE / "scripts" / "verify-pages-artifact.mjs").read_text(
        encoding="utf-8"
    )
    assert "knowledge-explorer/assets/i18n/th.json" in verifier
    assert "knowledge-explorer/assets/i18n/en.json" in verifier
    assert "node_modules" not in verifier


def test_public_api_manifest_count_is_unchanged() -> None:
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165

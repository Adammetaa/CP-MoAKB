from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).parents[2]
EXPLORER = ROOT / "prototype" / "knowledge-explorer"
DATA = EXPLORER / "assets" / "data" / "crop-protection-management-001.json"
PAGE = EXPLORER / "crop-protection-management.html"


def test_projection_counts_and_authorities_are_governed() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    assert data["meta"]["status"] == "accepted-internal-not-published"
    assert (
        data["meta"]["rights"]
        == "source-pages-images-tables-layout-and-passages-suppressed"
    )
    assert data["counts"] == {
        "domains": 3,
        "problem_subjects": 43,
        "evidence": 14,
        "claims": 22,
        "management_options": 7,
        "active_ingredients": 6,
        "moa_relationships": 6,
        "irac_relationships": 6,
        "frac_relationships": 0,
        "hrac_relationships": 0,
        "registration_relationships": 0,
        "questions": 16,
        "issues": 6,
        "packages": 1,
        "views": 1,
    }
    assert data["authorities"] == {
        "IRAC": "integrated-v11.5",
        "FRAC": "unresolved-source-absent",
        "HRAC": "unresolved-source-absent",
        "thai_registration": "separate-administrative-layer-no-use-edge",
    }


def test_page_exposes_options_moa_and_failed_control_without_selection() -> None:
    page = PAGE.read_text(encoding="utf-8")
    assert 'data-page="cropProtectionManagement"' in page
    assert "ตัวเลือกที่ไม่ใช้สาร" in page
    assert "CONTROL FAILURE ≠ RESISTANCE" in page
    assert "Management Option ไม่ใช่ Recommendation" in page
    for value in (
        "Carbofuran",
        "Fipronil",
        "Imidacloprid",
        "Cartap hydrochloride",
        "Buprofezin",
        "Chlorantraniliprole",
    ):
        assert value in page
    assert "ไม่มีความสัมพันธ์จากแมลงไปยัง IRAC Group" in page


def test_rights_product_dose_and_recommendation_boundaries_hold() -> None:
    page = PAGE.read_text(encoding="utf-8")
    serialized = DATA.read_text(encoding="utf-8")
    for prohibited in (
        "sourceExcerpt",
        "passageText",
        "imageUrl",
        "pdfUrl",
        "tradeName",
        "productRank",
        "<img",
    ):
        assert prohibited not in page and prohibited not in serialized
    assert "ไม่มีการเพิ่มอัตรา" in page
    assert "ไม่มี Recommendation" in page
    assert "ชื่อการค้า หรือข้อมูลผลิตภัณฑ์" in page


def test_explorer_and_assistant_link_management_view() -> None:
    assistant = (ROOT / "prototype" / "sp-assistant" / "index.html").read_text(
        encoding="utf-8"
    )
    assert 'href="crop-protection-management.html"' in (
        EXPLORER / "index.html"
    ).read_text(encoding="utf-8")
    assert 'href="crop-protection-management.html"' in (
        EXPLORER / "browse.html"
    ).read_text(encoding="utf-8")
    assert "../knowledge-explorer/crop-protection-management.html" in assistant
    assert "CONTROL FAILURE ≠ RESISTANCE" in assistant

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).parents[2]
EXPLORER = ROOT / "prototype" / "knowledge-explorer"
DATA = EXPLORER / "assets" / "data" / "rice-weed-corpus-001.json"
PAGE = EXPLORER / "rice-weed-corpus.html"


def _data() -> dict[str, Any]:
    return json.loads(DATA.read_text(encoding="utf-8"))


def test_weed_projection_has_governed_counts_and_unique_concepts() -> None:
    data = _data()
    assert data["meta"]["status"] == "accepted-internal-not-published"
    assert (
        data["meta"]["rights"]
        == "source-pages-images-tables-layout-and-passages-suppressed"
    )
    assert data["counts"] == {
        "subjects": 8,
        "evidence": 8,
        "claims": 28,
        "concepts": 16,
        "terminology": 8,
        "relationships": 19,
        "differential_relationships": 3,
        "questions": 13,
        "issues": 5,
        "packages": 8,
        "views": 8,
    }
    assert len(data["subjects"]) == 8
    assert len({item["key"] for item in data["subjects"]}) == 8
    assert len(data["sources"]) == 2


def test_every_weed_card_resolves_to_ckp_and_evidence_locator() -> None:
    data = _data()
    page = PAGE.read_text(encoding="utf-8")
    assert 'data-page="riceWeedCorpus"' in page
    for index, subject in enumerate(data["subjects"], 1):
        assert subject["name"] in page
        assert f"CKP-RWC-{index:03d}/v1" in page
    assert (
        "Website View" in page
        and "Evidence" in page
        and "Source + exact locator" in page
    )


def test_rights_diagnosis_resistance_and_recommendation_boundaries_hold() -> None:
    page = PAGE.read_text(encoding="utf-8")
    serialized = DATA.read_text(encoding="utf-8")
    for prohibited in (
        "sourceExcerpt",
        "passageText",
        "imageUrl",
        "pdfUrl",
        "tradeName",
        "dose",
        "<img",
    ):
        assert prohibited not in page and prohibited not in serialized
    assert "พ่นแล้วไม่ตาย ≠ ดื้อสาร" in page
    assert "ห้ามเพิ่มอัตราเกินฉลาก" in page
    assert "ทะเบียนไม่เท่ากับใช้ในข้าว" in page
    assert "ไม่มีการจัดอันดับผลิตภัณฑ์" in page


def test_explorer_and_sp_assistant_surface_weed_corpus() -> None:
    assistant = (ROOT / "prototype" / "sp-assistant" / "index.html").read_text(
        encoding="utf-8"
    )
    assert 'href="rice-weed-corpus.html"' in (EXPLORER / "index.html").read_text(
        encoding="utf-8"
    )
    assert 'href="rice-weed-corpus.html"' in (EXPLORER / "browse.html").read_text(
        encoding="utf-8"
    )
    assert "../knowledge-explorer/rice-weed-corpus.html" in assistant
    assert "กกขนาก" in assistant and "วัชพืช" in assistant

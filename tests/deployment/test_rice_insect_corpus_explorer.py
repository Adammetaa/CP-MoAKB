from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).parents[2]
EXPLORER = ROOT / "prototype" / "knowledge-explorer"
DATA = EXPLORER / "assets" / "data" / "rice-insect-corpus-001.json"
PAGE = EXPLORER / "rice-insect-corpus.html"


def _data() -> dict[str, Any]:
    return json.loads(DATA.read_text(encoding="utf-8"))


def test_insect_projection_has_governed_counts_and_unique_concepts() -> None:
    data = _data()
    assert data["meta"]["status"] == "accepted-internal-not-published"
    assert data["meta"]["rights"] == "source-pages-images-tables-layout-and-passages-suppressed"
    assert data["counts"] == {
        "subjects": 19, "evidence": 22, "claims": 59, "concepts": 49,
        "terminology": 38, "relationships": 48,
        "natural_enemy_relationships": 10, "questions": 9, "issues": 4,
        "packages": 19, "views": 19,
    }
    subjects = data["subjects"]
    assert len(subjects) == 19
    assert len({subject["key"] for subject in subjects}) == 19
    assert len(data["sources"]) == 3


def test_every_pest_page_card_resolves_to_ckp_and_evidence_locator() -> None:
    data = _data()
    page = PAGE.read_text(encoding="utf-8")
    assert 'data-page="riceInsectCorpus"' in page
    for index, subject in enumerate(data["subjects"], 1):
        assert subject["name"] in page
        assert subject["pages"].split(" / ")[0] in page
        assert f"CKP-RIC-{index:03d}/v1" in page
    assert "Website View" in page and "Evidence" in page and "Source + exact locator" in page


def test_rights_registration_resistance_and_diagnosis_boundaries_hold() -> None:
    page = PAGE.read_text(encoding="utf-8")
    serialized = DATA.read_text(encoding="utf-8")
    for prohibited in ("sourceExcerpt", "passageText", "imageUrl", "pdfUrl", "tradeName", "dose", "<img"):
        assert prohibited not in page
        assert prohibited not in serialized
    assert "ไม่ใช่หลักฐานทะเบียนปัจจุบัน" in page
    assert "ไม่เท่ากับการดื้อสาร" in page
    assert "ไม่สร้างคำวินิจฉัยหรือคำแนะนำ" in page


def test_explorer_and_sp_assistant_surface_insect_corpus_without_ranking() -> None:
    assistant = (ROOT / "prototype" / "sp-assistant" / "legacy.html").read_text(encoding="utf-8")
    assert 'href="rice-insect-corpus.html"' in (EXPLORER / "index.html").read_text(encoding="utf-8")
    assert 'href="rice-insect-corpus.html"' in (EXPLORER / "browse.html").read_text(encoding="utf-8")
    assert "../knowledge-explorer/rice-insect-corpus.html" in assistant
    assert "หนอนห่อใบข้าว" in assistant
    assert "เพลี้ยกระโดดสีน้ำตาล" in assistant
    assert "ไม่ใช่การจัดอันดับ" in assistant

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).parents[2]
EXPLORER = ROOT / "prototype" / "knowledge-explorer"


def _payload() -> dict[str, Any]:
    return json.loads(
        (EXPLORER / "assets" / "data" / "rice-disease-wave-001.json").read_text(
            encoding="utf-8"
        )
    )


def test_explorer_renders_two_real_governed_subjects_with_ckps() -> None:
    data = _payload()
    page = (EXPLORER / "rice-disease-wave-1.html").read_text(encoding="utf-8")

    assert data["meta"]["status"] == "accepted-internal-not-published"
    assert data["counts"]["packages"] == data["counts"]["views"] == 2
    assert len(data["subjects"]) == 2
    for subject in data["subjects"]:
        assert subject["package"].startswith("CKP-RDW1-")
        assert subject["view"].startswith("WV-RDW1-")
        assert subject["evidence"].startswith("EV-RDW1-")
        assert subject["name"] in page
        assert subject["package"] in page
        assert subject["view"] in page
    assert "REAL GOVERNED KNOWLEDGE" in page
    assert "fictional placeholder content" in page
    assert "not_published" in page
    assert 'href="rice-disease-wave-1.html"' in (
        (EXPLORER / "index.html").read_text(encoding="utf-8")
        + (EXPLORER / "browse.html").read_text(encoding="utf-8")
    )


def test_explorer_is_thai_first_static_traceable_and_rights_safe() -> None:
    page = (EXPLORER / "rice-disease-wave-1.html").read_text(encoding="utf-8")
    payload = (EXPLORER / "assets" / "data" / "rice-disease-wave-001.json").read_text(
        encoding="utf-8"
    )

    assert '<html lang="th">' in page
    assert "Source + exact locator" in page
    assert "GS-DOA-HAZARDOUS-SALES-2019-001/v1" in page
    assert 'data-page="riceDiseaseWave1"' in page
    assert "<img" not in page
    assert ".pdf" not in page.casefold()
    assert "โรคใบสีส้มของข้าวที่เกิดจากเพลี้ยจักจั่นสีเขียว" not in page
    assert "โรคจู๋ของข้าวที่เกิดจากเพลี้ยกระโดดสีน้ำตาล" not in page
    for prohibited in ("sourceExcerpt", "passageText", "imageUrl", "pdfUrl"):
        assert prohibited not in payload

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).parents[2]
EXPLORER = ROOT / "prototype" / "knowledge-explorer"


def _governed() -> dict[str, Any]:
    return json.loads(
        (EXPLORER / "assets" / "data" / "governed-batch-001.json").read_text(
            encoding="utf-8"
        )
    )


def test_governed_batch_identity_counts_and_rights_boundary() -> None:
    governed = _governed()

    assert governed["meta"] == {
        "kind": "real-governed-knowledge",
        "status": "accepted-internal-not-published",
        "language": "th",
        "rights": "public-source-excerpts-and-images-suppressed",
    }
    assert governed["package"]["id"] == "CKP-KPB-001/v1"
    assert governed["view"]["id"] == "WV-KPB-001/v1"
    assert governed["counts"] == {
        "evidence": 2,
        "claims": 2,
        "concepts": 3,
        "terminology": 4,
        "relationships": 2,
    }
    assert governed["traceability"]["issue"] == "UI-KPB-001/v1"


def test_real_page_is_thai_first_static_and_separate_from_placeholders() -> None:
    page = (EXPLORER / "real-knowledge.html").read_text(encoding="utf-8")

    assert '<html lang="th">' in page
    assert "REAL GOVERNED KNOWLEDGE" in page
    assert "CKP-KPB-001/v1" in page
    assert "WV-KPB-001/v1" in page
    assert "not_published" in page
    assert "fictional-placeholder" in page
    assert "data-governed-summary" in page
    assert "Source + exact locator" in page
    assert 'href="real-knowledge.html"' in (
        (EXPLORER / "index.html").read_text(encoding="utf-8")
        + (EXPLORER / "browse.html").read_text(encoding="utf-8")
    )


def test_public_representation_excludes_restricted_source_material() -> None:
    page = (EXPLORER / "real-knowledge.html").read_text(encoding="utf-8")
    payload = (EXPLORER / "assets" / "data" / "governed-batch-001.json").read_text(
        encoding="utf-8"
    )
    combined = page + payload

    assert (
        "โรคพืช เป็นการเปลี่ยนแปลงกระบวนการใช้พลังงานในระบบการดำรงชีวิต" not in combined
    )
    assert "สาเหตุการเกิดโรคพืชแยกออกเป็น 2 ประเภท คือ" not in combined
    assert "<img" not in page
    assert ".pdf" not in page.casefold()
    for prohibited_field in ("sourceExcerpt", "passageText", "imageUrl", "pdfUrl"):
        assert prohibited_field not in payload

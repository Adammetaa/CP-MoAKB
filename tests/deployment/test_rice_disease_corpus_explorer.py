from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).parents[2]
EXPLORER = ROOT / "prototype" / "knowledge-explorer"
DATA = EXPLORER / "assets" / "data" / "rice-disease-corpus-001.json"
PAGE = EXPLORER / "rice-disease-corpus.html"


def test_corpus_projection_has_governed_counts_and_unique_subjects() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    assert data["meta"] == {
        "kind": "real-governed-knowledge",
        "status": "accepted-internal-not-published",
        "language": "th",
        "rights": "source-pages-images-tables-layout-and-passages-suppressed",
    }
    assert data["counts"] == {
        "subjects": 16,
        "evidence": 26,
        "claims": 48,
        "concepts": 38,
        "terminology": 32,
        "relationships": 32,
        "issues": 4,
        "packages": 16,
        "views": 16,
    }
    assert len(data["subjects"]) == 16
    assert len({subject["key"] for subject in data["subjects"]}) == 16
    assert len(data["sources"]) == 2


def test_corpus_page_resolves_all_packages_without_source_material() -> None:
    page = PAGE.read_text(encoding="utf-8")
    data = json.loads(DATA.read_text(encoding="utf-8"))
    assert 'data-page="riceDiseaseCorpus"' in page
    assert "REAL GOVERNED KNOWLEDGE" in page
    assert "not_published" in page
    for number, subject in enumerate(data["subjects"], 1):
        assert subject["name"] in page
        assert f"CKP-RDC-{number:03d}/v1" in page
    for prohibited in ("sourceExcerpt", "passageText", "imageUrl", "pdfUrl", "<img"):
        assert prohibited not in page
        assert prohibited not in DATA.read_text(encoding="utf-8")


def test_corpus_is_linked_and_mock_content_remains_fictional() -> None:
    assert 'href="rice-disease-corpus.html"' in (EXPLORER / "index.html").read_text(encoding="utf-8")
    assert 'href="rice-disease-corpus.html"' in (EXPLORER / "browse.html").read_text(encoding="utf-8")
    mock = json.loads((EXPLORER / "assets" / "data" / "mock-knowledge.json").read_text(encoding="utf-8"))
    assert mock["meta"]["status"] == "fictional-placeholder"

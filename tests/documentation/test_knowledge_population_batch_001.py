from __future__ import annotations

from scripts.verify_documentation import (
    KNOWLEDGE_POPULATION_BATCH_001_DOCUMENTS,
    ROOT,
    verify,
)
from tests.contracts._api_manifest import PUBLIC_API_EXPORTS

SOURCE_HASH = "9b2a14d7ba2bcc5bc6bde236af406df64d42f9ac109c1f43b3e7923113b0ff22"


def _read(relative: str) -> str:
    return (ROOT / relative).read_text(encoding="utf-8")


def _all() -> str:
    return "\n".join(_read(path) for path in KNOWLEDGE_POPULATION_BATCH_001_DOCUMENTS)


def test_batch_materializes_the_exact_architecture_complete_inventory() -> None:
    text = _all()
    assert len(KNOWLEDGE_POPULATION_BATCH_001_DOCUMENTS) == 10
    assert all((ROOT / path).is_file() for path in KNOWLEDGE_POPULATION_BATCH_001_DOCUMENTS)
    for required in (
        "GS-DOA-HAZARDOUS-SALES-2019-001/v1",
        "EV-KPB-001/v1",
        "EV-KPB-002/v1",
        "CL-KPB-001/v1",
        "CL-KPB-002/v1",
        "CO-KPB-001/v1",
        "CO-KPB-002/v1",
        "CO-KPB-003/v1",
        "TM-KPB-004/v1",
        "RL-KPB-001/v1",
        "RL-KPB-002/v1",
        "CKP-KPB-001/v1",
        "WV-KPB-001/v1",
        "UI-KPB-001/v1",
        SOURCE_HASH,
    ):
        assert required in text
    assert len(verify()) == 689


def test_evidence_has_exact_bounded_text_and_stable_locators() -> None:
    text = _read("docs/knowledge/population-batch-001/evidence-records.md")
    for required in (
        "PDF page 36",
        "printed page `2-31`",
        "`P36-S1-A`",
        "โรคพืช เป็นการเปลี่ยนแปลงกระบวนการใช้พลังงานในระบบการดำรงชีวิต",
        "PDF page 37",
        "printed page `2-32`",
        "`P37-S3-A`",
        "สาเหตุการเกิดโรคพืชแยกออกเป็น 2 ประเภท คือ",
        "3.1 โรคพืชที่มีสาเหตุเกิดจากสิ่งไม่มีชีวิต",
        "3.2 โรคพืชที่มีสาเหตุเกิดจากสิ่งมีชีวิต",
    ):
        assert required in text


def test_bidirectional_website_trace_and_rights_gate_are_explicit() -> None:
    text = _read(
        "docs/knowledge/population-batch-001/website-view-and-traceability.md"
    )
    for required in (
        "Forward:",
        "Reverse:",
        "internal Disease Detail placement",
        "Claim -> Evidence -> Source",
        "`internal`, `not_published`",
        "blocks public Website representation",
        "public Website-ready objects:\n**zero**",
    ):
        assert required in text


def test_batch_preserves_scientific_and_engineering_boundaries() -> None:
    text = _all()
    for prohibited in (
        "confidence score:",
        "recommended product:",
        "field diagnosis:",
        '"type": "object"',
        "CREATE TABLE",
        "schema_version:",
        "openapi:",
    ):
        assert prohibited not in text.lower()
    assert "No Agronomist escalation is opened" in text
    assert "Neither is\na Hypothesis, Diagnosis, Recommendation" in text
    assert sum(len(symbols) for symbols in PUBLIC_API_EXPORTS.values()) == 165

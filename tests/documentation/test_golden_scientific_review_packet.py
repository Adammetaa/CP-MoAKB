from __future__ import annotations

from scripts.verify_documentation import (
    KNOWLEDGE_GOLDEN_SLICE_DOCUMENTS,
    ROOT,
    verify,
)

PACKET = "docs/knowledge/golden-knowledge-slice/scientific-review-packet-th.md"


def _packet() -> str:
    return (ROOT / PACKET).read_text(encoding="utf-8")


def test_thai_first_packet_binds_the_fixed_source_evidence_and_claims() -> None:
    text = _packet()
    for required in (
        "GS-RICE-DISEASES-001",
        "EC-GOLDEN-001",
        "EC-GOLDEN-002",
        "CL-GOLDEN-001/v1",
        "CL-GOLDEN-002/v1",
        "UI-GOLDEN-001",
        "P5-A",
        "P6-A",
        "9cd74da88828fbc6d5dcbfdfbcaa0a20e45752a7f21a7d8503b1263d8a6eef2d",
        "เชื้อสาเหตุ : เชื้อรา Pyricularia grisea",
        "เริ่มแรกมีแผล จุดสีน้ำตาลคล้ายรูปตา มีสีเทาอยู่ตรงกลางแผล",
    ):
        assert required in text
    assert len(KNOWLEDGE_GOLDEN_SLICE_DOCUMENTS) == 7
    assert len(verify()) == 625


def test_packet_has_uncompleted_human_identity_competence_and_conflict_fields() -> None:
    text = _packet()
    for required in (
        "ชื่อผู้ทบทวน:",
        "บทบาท:",
        "องค์กร:",
        "ประสบการณ์เกี่ยวกับข้าว:",
        "ความเชี่ยวชาญด้านโรคพืช/โรคข้าว:",
        "วันที่ทบทวน:",
        "ไม่พบ (`none known`)",
        "(`disclosed`)",
        "(`uncertain`)",
        "หากไม่กรอกคำประกาศ ห้ามเริ่มการทบทวน",
    ):
        assert required in text
    assert "ชื่อผู้ทบทวน: __________________________________" in text


def test_packet_uses_only_governed_dispositions_and_preserves_human_authority() -> None:
    text = _packet()
    for disposition in (
        "`approve`",
        "`approve with required revision`",
        "`return for revision`",
        "`reject`",
        "`defer`",
        "`escalate`",
        "`recuse`",
    ):
        assert disposition in text
    for required in (
        "`resolves`",
        "`partially resolves`",
        "`does not resolve`",
        "ห้ามปิดอัตโนมัติ",
        "ไม่ใช่การวินิจฉัย",
        "ไม่ใช่คำแนะนำ",
        "ไม่ใช่การยอมรับ Package",
        "ไม่ใช่การอนุญาตให้เผยแพร่",
    ):
        assert required in text

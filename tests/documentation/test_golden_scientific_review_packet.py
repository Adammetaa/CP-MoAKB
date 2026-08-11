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
    for exact_claim_wording in (
        "Within the exact Source version and the displayed `โรคไหม้ (Rice Blast)` section,",
        "This is a source-attributed proposition, not an independently accepted taxonomic",
        "Within the exact Source version, on the page immediately following the displayed",
        "This is a source-attributed proposition and not a diagnostic rule or an assertion",
    ):
        assert exact_claim_wording in text
    assert len(KNOWLEDGE_GOLDEN_SLICE_DOCUMENTS) == 7
    assert len(verify()) == 668


def test_packet_has_uncompleted_human_identity_competence_and_conflict_fields() -> None:
    text = _packet()
    for required in (
        "ชื่อผู้ตรวจ:",
        "ตำแหน่ง:",
        "หน่วยงาน:",
        "ประสบการณ์ด้านข้าว:",
        "Rice pathology",
        "วันที่ตรวจ:",
        "ไม่พบ (`none known`)",
        "(`disclosed`)",
        "(`uncertain`)",
        "หากไม่กรอกคำประกาศ ห้ามเริ่มตรวจเนื้อหา",
    ):
        assert required in text
    assert "ชื่อผู้ตรวจ: __________________________________" in text


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
        "ไม่ปิด `UI-GOLDEN-001` อัตโนมัติ",
        "ไม่ใช่การวินิจฉัย",
        "ไม่ใช่คำแนะนำ",
        "ไม่ใช่การยอมรับ Package",
        "ไม่ใช่การอนุญาตให้เผยแพร่",
    ):
        assert required in text


def test_packet_is_the_obvious_entry_point_and_has_compact_case_order() -> None:
    text = _packet()
    readme = (ROOT / "docs/knowledge/golden-knowledge-slice/README.md").read_text(
        encoding="utf-8"
    )
    assert text.startswith("# แบบตรวจทานองค์ความรู้โรคข้าว\n")
    assert "ผู้ตรวจไม่จำเป็นต้องเข้าใจ Architecture ของ CP-MoAKB" in text
    assert "## วิธีตรวจ" in text
    assert "[แบบตรวจทานองค์ความรู้โรคข้าว](scientific-review-packet-th.md)" in readme
    for claim in ("001", "002"):
        case = text.index(f"## กรณีที่ {int(claim)}")
        source = text.index("### A. ข้อความต้นฉบับจาก Source", case)
        evidence = text.index("### B. Evidence Candidate", case)
        candidate = text.index("### C. Claim Candidate", case)
        comparison = text.index("### D. Reviewer comparison", case)
        assert case < source < evidence < candidate < comparison

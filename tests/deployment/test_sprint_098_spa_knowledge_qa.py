from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"
QA = (ASSISTANT / "assets" / "knowledge-qa.js").read_text(encoding="utf-8")
APP = (ASSISTANT / "assets" / "app.js").read_text(encoding="utf-8")
HTML = (ASSISTANT / "index.html").read_text(encoding="utf-8")
CSS = (ASSISTANT / "assets" / "styles.css").read_text(encoding="utf-8")


def test_knowledge_query_runs_inside_sp_assistant() -> None:
    assert 'src="assets/knowledge-qa.js?v=source-tree"' in HTML
    assert "window.SPKnowledgeQA?.isKnowledgeQuery(text)" in APP
    assert "window.SPKnowledgeQA.ask(text)" in APP
    for intent in (
        "ACTIVE_INGREDIENT_LOOKUP",
        "MECHANISM_LOOKUP",
        "RELATED_SUBSTANCE_LOOKUP",
        "TARGET_TO_SUBSTANCE",
        "SUBSTANCE_TO_PRODUCT",
        "SOURCE_LOOKUP",
    ):
        assert intent in QA


def test_golden_subject_and_bounded_follow_up_context_are_present() -> None:
    assert 'thiamethoxam: { name: "thiamethoxam"' in QA
    assert 'thai: "ไทอะมีทอกแซม"' in QA
    assert 'group: "4A"' in QA
    assert "context.subject" in QA
    assert "resolveSubject(text)" in QA
    assert "general autonomous memory" not in QA


def test_governed_moa_and_relationship_boundaries_are_visible() -> None:
    for value in (
        "nAChR competitive modulator",
        'group: "9B"',
        "FRAC",
        "HRAC",
        "SAME_MOA",
        "same MoA ≠ interchangeable",
        "Mechanism ≠ field efficacy ≠ recommendation",
    ):
        assert value in QA


def test_target_and_product_discovery_are_bounded() -> None:
    assert "สารที่ระบบพบหลักฐานเชื่อมโยงกับเป้าหมายนี้" in QA
    assert "รายการนี้ไม่ใช่สารทั้งหมดที่ใช้ได้" in QA
    for registration in ("1372-2565", "405-2555", "602-2555"):
        assert registration in QA
    assert "ไม่ใช่ catalog ทั้งหมด" in QA
    assert "no dose or ranking is provided" in QA


def test_registration_and_ctu_are_independent_visible_states() -> None:
    for state in (
        "CURRENT_RECORD_SUPPORTED",
        "EXPIRED",
        "PENDING",
        "NOT_ESTABLISHED",
    ):
        assert state in QA
    assert "ทะเบียนผลิตภัณฑ์" in QA
    assert "สิทธิ์พืช–เป้าหมาย–การใช้" in QA
    assert "Registration status and CTU authority are independent" in QA


def test_provenance_preserves_authority_version_locator_and_limitations() -> None:
    for field in ("authority", "id", "version", "locator", "limitation"):
        assert f"source.{field}" in QA
    for authority in ("IRAC", "FRAC", "HRAC", "Thai DOA"):
        assert authority in QA
    assert "knowledge-provenance" in QA


def test_spa_review_and_structured_correction_states() -> None:
    for state in (
        "CORRECT",
        "INCORRECT",
        "INCOMPLETE",
        "PENDING_REVIEW",
        "SUPPORTED_CORRECTION",
        "REJECTED_CORRECTION",
        "SUPERSEDED",
    ):
        assert state in QA
    for correction_type in (
        "IDENTITY",
        "TERMINOLOGY",
        "MOA",
        "MECHANISM",
        "TARGET",
        "CROP",
        "PRODUCT",
        "REGISTRATION",
        "CTU",
        "SOURCE",
        "OTHER",
    ):
        assert correction_type in QA
    assert "ยังไม่เปลี่ยน Canonical Knowledge" in QA


def test_review_records_are_local_refresh_safe_and_exportable() -> None:
    assert 'STORAGE_KEY = "sp_assistant_spa_reviews_v1"' in QA
    assert "localStorage.getItem(STORAGE_KEY)" in QA
    assert "localStorage.setItem(STORAGE_KEY" in QA
    for field in (
        "review_id",
        "conversation_id",
        "message_id",
        "question_text",
        "subject_reference",
        "answer_reference",
        "answer_snapshot_or_hash",
        "review_state",
        "correction_type",
        "correction_text",
        "source_reference_optional",
        "reviewer_role",
        "created_at",
        "updated_at",
        "supersession_reference",
        "knowledge_version_reference_if_available",
    ):
        assert field in QA
    assert "application_version" in QA
    assert "record_count" in QA
    assert "data:application/json;charset=utf-8" in QA
    assert "download = `sp-assistant-spa-review-" in QA


def test_privacy_cloud_and_learning_boundaries() -> None:
    assert "No GPS, device identifier, IP, personal name, phone, email" in QA
    for forbidden in ("fetch(", "XMLHttpRequest", "WebSocket", "sendBeacon"):
        assert forbidden not in QA
    assert "canonical" not in QA.lower() or "Canonical Knowledge" in QA


def test_mobile_review_controls_wrap_without_horizontal_layout() -> None:
    assert ".review-actions{display:flex;flex-wrap:wrap" in CSS
    assert ".review-actions>*{flex:1 1 30%" in CSS
    assert (
        ".knowledge-answer dl,.knowledge-product dl{grid-template-columns:1fr}" in CSS
    )
    assert ".review-history [data-export-review]{width:100%" in CSS

import json
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"
QA = ASSISTANT / "assets" / "knowledge-qa.js"
APP = (ASSISTANT / "assets" / "app.js").read_text(encoding="utf-8")
NODE = shutil.which("node") or str(
    Path.home()
    / ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe"
)


def classify(queries: list[str]) -> list[dict]:
    script = (
        "global.window={};"
        "global.crypto=require('node:crypto').webcrypto;"
        f"require({json.dumps(str(QA))});"
        f"process.stdout.write(JSON.stringify({json.dumps(queries)}.map(q=>window.SPKnowledgeQA.classify(q))));"
    )
    completed = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(completed.stdout)


def test_explicit_identity_and_mechanism_questions_route_before_case() -> None:
    results = classify(
        [
            "ไทอะมีทอกแซมคืออะไร",
            "ไทอะมีทอกแซมออกฤทธิ์ยังไง",
        ]
    )
    assert results == [
        {
            "intent": "ACTIVE_INGREDIENT_LOOKUP",
            "subject": "thiamethoxam",
            "resolved": True,
        },
        {
            "intent": "MECHANISM_LOOKUP",
            "subject": "thiamethoxam",
            "resolved": True,
        },
    ]


def test_pretilachlor_aliases_enter_bounded_knowledge_clarification() -> None:
    results = classify(
        [
            "เพทิลาคลอร์ ออกฤทธิ์ ยังไง",
            "พรีทิลาคลอร์ออกฤทธิ์อย่างไร",
            "pretilachlor ยับยั้งอะไร",
        ]
    )
    assert (
        results
        == [
            {
                "intent": "MECHANISM_LOOKUP",
                "subject": "pretilachlor",
                "resolved": False,
            }
        ]
        * 3
    )


def test_follow_up_group_product_and_source_retain_subject() -> None:
    results = classify(
        [
            "thiamethoxam คืออะไร",
            "อยู่กลุ่มอะไร",
            "มีชื่อยาอะไร",
            "ข้อมูลมาจากไหน",
        ]
    )
    assert [item["subject"] for item in results] == ["thiamethoxam"] * 4
    assert [item["intent"] for item in results] == [
        "ACTIVE_INGREDIENT_LOOKUP",
        "MECHANISM_LOOKUP",
        "SUBSTANCE_TO_PRODUCT",
        "SOURCE_LOOKUP",
    ]


def test_target_discovery_is_knowledge_first() -> None:
    result = classify(["เพลี้ยไฟมีสารอะไร"])[0]
    assert result["intent"] == "TARGET_TO_SUBSTANCE"


def test_field_suitability_questions_remain_case_first() -> None:
    results = classify(
        [
            "ข้าว 45 วันมีเพลี้ยไฟ ใช้อะไรดี",
            "แปลงนี้ควรพ่นอะไร",
            "ใช้ pretilachlor กับข้าวตอนนี้ได้ไหม",
        ]
    )
    assert all(item["intent"] is None for item in results)


def test_unknown_identity_does_not_infer_agricultural_knowledge() -> None:
    qa = QA.read_text(encoding="utf-8")
    assert "governed knowledge ปัจจุบันยังไม่มีระเบียนที่ยืนยันตัวตน" in qa
    assert "หมายถึง pretilachlor ใช่หรือไม่?" in qa
    assert "no identity, MoA, product or use fact is inferred" in qa
    assert "terminologyAliases" in qa


def test_natural_language_route_reuses_sprint_098_qa_flow() -> None:
    qa = QA.read_text(encoding="utf-8")
    assert "reviewPanel(messageId)" in qa
    assert 'data-review="CORRECT"' in qa
    assert 'data-review="INCORRECT"' in qa
    assert 'data-review="INCOMPLETE"' in qa
    assert "data-export-review" in qa
    assert "window.SPKnowledgeQA?.isKnowledgeQuery(text)" in APP
    assert "window.SPKnowledgeQA.ask(text)" in APP

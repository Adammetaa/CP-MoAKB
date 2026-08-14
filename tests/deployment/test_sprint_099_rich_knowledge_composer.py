import json
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"
QA_PATH = ASSISTANT / "assets" / "knowledge-qa.js"
QA = QA_PATH.read_text(encoding="utf-8")
CSS = (ASSISTANT / "assets" / "styles.css").read_text(encoding="utf-8")
NODE = shutil.which("node") or str(
    Path.home()
    / ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe"
)


def classify(queries: list[str]) -> list[dict]:
    script = (
        "global.window={};"
        "global.crypto=require('node:crypto').webcrypto;"
        f"require({json.dumps(str(QA_PATH))});"
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


def test_rich_answer_composes_only_existing_governed_fields() -> None:
    for heading in (
        "กลไกการออกฤทธิ์",
        "สารที่เกี่ยวข้อง",
        "เป้าหมายที่มีหลักฐานเชื่อมโยง",
        "ผลิตภัณฑ์ที่พบ",
    ):
        assert heading in QA
    assert "knowledge-summary" in QA
    assert "knowledge-section" in QA
    assert "ยังไม่พบข้อมูลในชุดความรู้ปัจจุบัน" in QA
    assert "sourceDetails(answer.evidence)" in QA


def test_follow_up_actions_reuse_the_current_subject_and_router() -> None:
    results = classify(
        [
            "ไทอะมีทอกแซมคืออะไร",
            "ออกฤทธิ์ยังไง",
            "ใช้กับอะไร",
            "มีกลุ่มอื่นไหม",
            "มีชื่อยาอะไรบ้าง",
            "ดูแหล่งข้อมูล",
        ]
    )
    assert [result["subject"] for result in results] == ["thiamethoxam"] * 6
    assert [result["intent"] for result in results] == [
        "ACTIVE_INGREDIENT_LOOKUP",
        "MECHANISM_LOOKUP",
        "SUBSTANCE_TO_TARGET",
        "RELATED_SUBSTANCE_LOOKUP",
        "SUBSTANCE_TO_PRODUCT",
        "SOURCE_LOOKUP",
    ]
    for label in (
        "ออกฤทธิ์ยังไง",
        "ใช้กับอะไร",
        "มีกลุ่มอื่นไหม",
        "มีชื่อยาอะไรบ้าง",
        "ดูแหล่งข้อมูล",
    ):
        assert f'data-knowledge-follow-up="{label}"' in QA
    assert "ask(button.dataset.knowledgeFollowUp)" in QA


def test_qa_and_safety_boundaries_remain_visible() -> None:
    for control in (
        'data-review="CORRECT"',
        'data-review="INCORRECT"',
        'data-review="INCOMPLETE"',
    ):
        assert control in QA
    for boundary in (
        "กลไก ≠ ประสิทธิภาพภาคสนาม ≠ คำแนะนำ",
        "สารที่มีกลไกเกี่ยวข้อง ≠ ใช้แทนกันได้",
        "ทะเบียนผลิตภัณฑ์ ≠ สิทธิ์พืช–เป้าหมาย–การใช้ (CTU)",
        "no dose or ranking is provided",
    ):
        assert boundary in QA


def test_mobile_actions_wrap_and_qa_controls_stay_compact() -> None:
    assert ".knowledge-follow-ups{display:flex;flex-wrap:wrap" in CSS
    assert ".knowledge-follow-ups button{flex:1 1 auto}" in CSS
    assert ".review-actions>*{flex:1 1 30%" in CSS

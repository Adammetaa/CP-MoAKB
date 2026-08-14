import json
import shutil
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ASSISTANT = ROOT / "prototype" / "sp-assistant"
CHEMICAL = ASSISTANT / "assets" / "chemical-slice.js"
APP = (ASSISTANT / "assets" / "app.js").read_text(encoding="utf-8")
CSS = (ASSISTANT / "assets" / "styles.css").read_text(encoding="utf-8")
NODE = shutil.which("node") or str(
    Path.home()
    / ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe"
)


def run(expression: str) -> dict:
    script = (
        "global.window={};"
        f"require({json.dumps(str(CHEMICAL))});"
        f"process.stdout.write(JSON.stringify({expression}));"
    )
    completed = subprocess.run(
        [NODE, "-e", script],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    return json.loads(completed.stdout)


def decision(status: str, count: int) -> str:
    return json.dumps(
        {
            "needForAction": {
                "status": status,
                "observedValue": count,
                "explanation": f"observed {count} insects_per_plant",
                "evidence": {
                    "id": "AE-076-BPH-001/v1",
                    "claim": "CL-076-BPH-ET-001/v1",
                    "evidence": "EV-076-BPH-ET-001/v1",
                    "triggerValue": 10,
                    "limitations": ["sampling-unit limitation"],
                    "source": {
                        "authority": "Rice Department, Thailand",
                        "id": "GS-RD-ANNUAL-2023-BPH-001/v1",
                        "locator": "PDF p.58",
                    },
                },
            }
        }
    )


def test_below_criterion_renders_monitoring_without_chemical_options() -> None:
    result = run(
        "(()=>{const r=window.SPChemicalSlice.evaluate({"
        'isBph:true,currentActivity:"found",insectsPerPlant:8,'
        f"decision:{decision('CONTINUE_MONITORING', 8)}}});"
        "return {result:r,html:window.SPChemicalSlice.render(r),actions:window.SPChemicalSlice.availableFollowUps(r)}})()"
    )
    assert result["result"]["needForAction"] == "CONTINUE_MONITORING"
    assert result["result"]["options"] == []
    assert "ยังไม่เปิด Management Review" in result["html"]
    assert "ไม่แสดงตัวเลือกสาร" in result["html"]
    assert "chemical-option-card" not in result["html"]
    assert result["actions"] == ["WHY_MONITOR", "MISSING_EVIDENCE", "SOURCES"]


def test_at_criterion_renders_bounded_product_evidence_not_a_spray_order() -> None:
    result = run(
        "(()=>{const r=window.SPChemicalSlice.evaluate({"
        'isBph:true,currentActivity:"found",insectsPerPlant:10,previousTreatment:"none",'
        f"decision:{decision('MANAGEMENT_REVIEW_JUSTIFIED', 10)}}});"
        "return {result:r,html:window.SPChemicalSlice.render(r),actions:window.SPChemicalSlice.availableFollowUps(r)}})()"
    )
    assert result["result"]["needForAction"] == "MANAGEMENT_REVIEW_JUSTIFIED"
    assert len(result["result"]["options"]) == 2
    assert all(
        option["optionState"] == "BLOCKED_BY_AUTHORITY"
        for option in result["result"]["options"]
    )
    assert "ควรเปิดการทบทวนแนวทางจัดการ" in result["html"]
    assert "ไม่ได้แปลว่าต้องพ่นสาร" in result["html"]
    assert "PROVISIONAL_PRODUCT_EVIDENCE · BLOCKED_BY_AUTHORITY" in result["html"]
    assert "REGULATORY_CTU_CONFIRMATION_PENDING" in result["html"]
    assert "Option ≠ Recommendation" in result["html"]
    assert "SPRAY_REQUIRED" not in result["html"]
    assert set(result["actions"]) == {
        "OPTIONS",
        "RATE",
        "MOA",
        "PREVIOUS_TREATMENT",
        "MISSING_EVIDENCE",
        "SOURCES",
    }


def test_follow_ups_reuse_case_result_and_only_show_supported_rate() -> None:
    result = run(
        "(()=>{const r=window.SPChemicalSlice.evaluate({"
        'isBph:true,currentActivity:"found",insectsPerPlant:10,previousTreatment:"pymetrozine",'
        f"decision:{decision('MANAGEMENT_REVIEW_JUSTIFIED', 10)}}});"
        "return {rate:window.SPChemicalSlice.renderFollowUp(r,'RATE'),"
        "moa:window.SPChemicalSlice.renderFollowUp(r,'MOA'),"
        "previous:window.SPChemicalSlice.renderFollowUp(r,'PREVIOUS_TREATMENT'),"
        "unsupported:window.SPChemicalSlice.renderFollowUp(r,'WHY_MONITOR')}})()"
    )
    assert "20 g / 20 L water" in result["rate"]
    assert "ไม่ใช่อัตราสำหรับเคสนี้" in result["rate"]
    assert "IRAC 9B" in result["moa"]
    assert "Different MoA ≠ Better" in result["moa"]
    assert "pymetrozine" in result["previous"]
    assert "Failed control ≠ Resistance" in result["previous"]
    assert result["unsupported"] == ""


def test_existing_case_renderer_wires_decision_context_without_ui_redesign() -> None:
    assert "decision: caseState.decision" in APP
    assert "SPChemicalSlice?.render(caseState.chemicalSlice)" in APP
    assert "SPChemicalSlice?.renderFollowUp(caseState.chemicalSlice" in APP
    assert "data-decision-follow-up-output" in CHEMICAL.read_text(encoding="utf-8")
    assert ".decision-follow-up-answer" in CSS

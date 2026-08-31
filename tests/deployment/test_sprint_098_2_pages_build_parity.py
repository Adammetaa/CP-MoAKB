import json
import os
import shutil
import subprocess
from pathlib import Path

import pytest


ROOT = Path(__file__).resolve().parents[2]
EXPLORER = ROOT / "prototype" / "knowledge-explorer"
ARTIFACT = EXPLORER / "dist" / "pages-root" / "sp-assistant"
TEST_COMMIT = "a2d41b04c3706a80b5b8b43e87c2ca5d3e47094e"


def test_pages_build_contains_current_assistant_with_visible_identity() -> None:
    node = os.environ.get("NODE_EXE") or shutil.which("node")
    if not node:
        pytest.skip("Node.js is required to exercise the Pages build")
    env = os.environ.copy()
    env.update(
        DEPLOY_COMMIT=TEST_COMMIT,
        BUILD_TIMESTAMP="2026-08-14T00:00:00.000Z",
        PACKAGE_VERSION="0.1.0",
    )
    completed = subprocess.run(
        [node, "scripts/build.mjs"],
        cwd=EXPLORER,
        env=env,
        capture_output=True,
        text=True,
        check=False,
    )
    assert completed.returncode == 0, completed.stdout + completed.stderr
    assert "69 approved files" in completed.stdout

    html = (ARTIFACT / "index.html").read_text(encoding="utf-8")
    version = TEST_COMMIT[:12]
    assert f"<p data-build-version>Build: {version}</p>" in html
    assert f'src="assets/field-app.js?v={version}"' in html
    assert f'href="assets/field-shell.css?v={version}"' in html
    for asset in ("field-app.js", "field-shell.css", "governed-spa-runtime.js", "server-workspace-adapter.js"):
        assert (ARTIFACT / "assets" / asset).is_file()

    runtime = (ARTIFACT / "assets" / "governed-spa-runtime.js").read_text(encoding="utf-8")
    for marker in ("SERVER_CONFIRMED", "LOCAL_DRAFT", "question_limit_per_turn", "Learning Candidate"):
        assert marker in runtime

    metadata = json.loads((ARTIFACT / "deployment.json").read_text(encoding="utf-8"))
    assert metadata["commit"] == TEST_COMMIT
    assert metadata["build_timestamp"] == "2026-08-14T00:00:00.000Z"

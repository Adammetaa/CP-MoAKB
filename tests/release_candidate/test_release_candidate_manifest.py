from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).parents[2]


def test_release_candidate_manifest_is_static_and_unpublished() -> None:
    manifest = json.loads(
        (ROOT / "docs/release/release-candidate-manifest.json").read_text(
            encoding="utf-8"
        )
    )

    assert manifest["baseline_commit"] == "8b5d7a3473d02c6ab796046f8d761e8aa95227eb"
    assert manifest["package"]["version"] == "0.1.0"
    assert manifest["package"]["license"] == "Apache-2.0"
    assert manifest["public_api_manifest_entries"] == 165
    assert manifest["publication_status"] == "not_published"
    assert len(manifest["approval_required_actions"]) == 6

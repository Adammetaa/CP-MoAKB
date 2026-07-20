from __future__ import annotations

import re
import tomllib
from pathlib import Path

ROOT = Path(__file__).parents[2]


def test_direct_dependencies_are_exact_registry_pins() -> None:
    project = tomllib.loads((ROOT / "pyproject.toml").read_text(encoding="utf-8"))[
        "project"
    ]
    requirements = list(project["dependencies"])
    for values in project["optional-dependencies"].values():
        requirements.extend(values)
    assert requirements
    assert all(re.fullmatch(r"[A-Za-z0-9_.-]+==[^\s;]+", item) for item in requirements)
    assert not any(
        re.search(r"https?://|git\+|file:|\s@\s", item) for item in requirements
    )


def test_workflow_has_minimal_permissions_and_no_release_authority() -> None:
    workflow = (ROOT / ".github" / "workflows" / "ci.yml").read_text(encoding="utf-8")
    assert "permissions:\n  contents: read" in workflow
    assert "Security and release readiness" in workflow
    assert "${{ secrets." not in workflow
    assert "id-token: write" not in workflow
    assert "packages: write" not in workflow
    assert not re.search(r"uses:\s*[^@\s]+@(?![0-9a-f]{40}\b)", workflow)

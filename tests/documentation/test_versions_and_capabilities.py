from __future__ import annotations

from scripts.verify_documentation import ROOT
from scripts.verify_release_readiness import EXPECTED_VERSIONS, authoritative_versions


def test_authoritative_versions_remain_unchanged() -> None:
    assert authoritative_versions() == EXPECTED_VERSIONS


def test_landing_page_states_critical_non_capabilities() -> None:
    readme = (ROOT / "README.md").read_text(encoding="utf-8").casefold()
    for term in (
        "not an agricultural diagnosis",
        "recommendation",
        "ranking",
        "confidence-scoring",
        "ai",
        "llm",
        "not a production web",
        "usable agricultural knowledge base",
    ):
        assert term in readme

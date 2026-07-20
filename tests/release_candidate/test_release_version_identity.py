from __future__ import annotations

from scripts.verify_release_readiness import EXPECTED_VERSIONS, authoritative_versions


def test_all_frozen_version_authorities_remain_exact() -> None:
    assert (
        authoritative_versions()
        == EXPECTED_VERSIONS
        == {
            "package": "0.1.0",
            "runtime": "0.1",
            "yaml": "1.0",
            "projection": "1.0",
            "application": "0.1",
            "http": "0.1",
            "cli": "0.1",
            "composition": "0.1",
        }
    )

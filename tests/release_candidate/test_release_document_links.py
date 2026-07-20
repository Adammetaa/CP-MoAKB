from __future__ import annotations

from scripts.verify_documentation import verify


def test_governed_release_document_links_and_claims_pass() -> None:
    assert len(verify()) == 231

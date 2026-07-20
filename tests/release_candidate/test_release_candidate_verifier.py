from __future__ import annotations

from scripts.verify_release_candidate import REQUIRED_RELEASE_DOCUMENTS, verify


def test_release_candidate_verification_is_deterministic() -> None:
    first = verify(orchestrate=False)
    second = verify(orchestrate=False)

    assert first == second == REQUIRED_RELEASE_DOCUMENTS

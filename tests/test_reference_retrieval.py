from __future__ import annotations

import hashlib
from pathlib import Path

import pytest

from scripts.retrieve_irac_reference import (
    ReferenceRetrievalError,
    retrieve_reference,
    verify_reference,
)


def test_reference_verification_accepts_exact_identity(tmp_path: Path) -> None:
    content = b"synthetic reference fixture"
    path = tmp_path / "reference.pdf"
    path.write_bytes(content)

    verify_reference(
        path,
        expected_sha256=hashlib.sha256(content).hexdigest(),
        expected_size=len(content),
    )


def test_reference_verification_rejects_changed_content(tmp_path: Path) -> None:
    path = tmp_path / "reference.pdf"
    path.write_bytes(b"changed")

    with pytest.raises(ReferenceRetrievalError, match="identity mismatch"):
        verify_reference(path)


def test_retrieval_rejects_destination_outside_reference_directory(
    tmp_path: Path,
) -> None:
    with pytest.raises(ReferenceRetrievalError, match="leaves references/IRAC"):
        retrieve_reference(tmp_path / "reference.pdf")

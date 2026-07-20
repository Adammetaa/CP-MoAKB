"""Retrieve and verify the untracked IRAC v11.5 parser reference.

This development-only utility downloads from one governed publisher URL. It does
not discover sources, run at Runtime, or grant redistribution rights.
"""

from __future__ import annotations

import argparse
import hashlib
import os
import tempfile
from collections.abc import Callable
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
REFERENCE_DIRECTORY = ROOT / "references" / "IRAC"
REFERENCE_PATH = REFERENCE_DIRECTORY / "IRAC_MoA_Classification_v11.5_2026.pdf"
OFFICIAL_URL = "https://irac-online.org/documents/moa-classification/?ext=pdf"
EXPECTED_SHA256 = "74641b0f56bcfb46574fd0dc815ee136170af66385950ad61045a0692ea750d6"
EXPECTED_SIZE = 1_480_259


class ReferenceRetrievalError(RuntimeError):
    """The official reference could not be retrieved or verified safely."""


def _digest(path: Path) -> tuple[str, int]:
    digest = hashlib.sha256()
    size = 0
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
            size += len(chunk)
    return digest.hexdigest(), size


def verify_reference(
    path: Path,
    *,
    expected_sha256: str = EXPECTED_SHA256,
    expected_size: int = EXPECTED_SIZE,
) -> None:
    """Verify exact identity without parsing or changing the source."""

    if not path.is_file():
        raise ReferenceRetrievalError(f"reference file is missing: {path.name}")
    actual_sha256, actual_size = _digest(path)
    if actual_sha256 != expected_sha256 or actual_size != expected_size:
        raise ReferenceRetrievalError(
            "reference identity mismatch: expected governed SHA-256 and byte size"
        )


def _download(path: Path) -> None:
    with urlopen(OFFICIAL_URL, timeout=60) as response, path.open("wb") as output:
        while chunk := response.read(1024 * 1024):
            output.write(chunk)


def retrieve_reference(
    destination: Path = REFERENCE_PATH,
    *,
    replace: bool = False,
    downloader: Callable[[Path], None] = _download,
) -> None:
    """Retrieve to a temporary file, verify, then atomically place it."""

    resolved = destination.resolve()
    try:
        resolved.relative_to(REFERENCE_DIRECTORY.resolve())
    except ValueError as error:
        raise ReferenceRetrievalError("destination leaves references/IRAC") from error
    if resolved.exists() and not replace:
        verify_reference(resolved)
        return
    resolved.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=".irac-reference-", suffix=".pdf", dir=resolved.parent
    )
    os.close(descriptor)
    temporary = Path(temporary_name)
    try:
        downloader(temporary)
        verify_reference(temporary)
        temporary.replace(resolved)
    except Exception:
        temporary.unlink(missing_ok=True)
        raise


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="verify an existing local reference without network access",
    )
    parser.add_argument(
        "--replace",
        action="store_true",
        help="download and replace only after exact verification succeeds",
    )
    arguments = parser.parse_args()
    if arguments.verify_only:
        verify_reference(REFERENCE_PATH)
        action = "verified"
    else:
        retrieve_reference(replace=arguments.replace)
        action = "retrieved and verified"
    print(f"IRAC reference {action}: sha256={EXPECTED_SHA256} bytes={EXPECTED_SIZE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

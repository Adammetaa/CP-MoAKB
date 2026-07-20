"""Verify governed wheel and source-distribution contracts without extraction."""

from __future__ import annotations

import argparse
import hashlib
import tarfile
import zipfile
from email.parser import BytesParser
from email.policy import default
from pathlib import Path, PurePosixPath
from typing import Iterable

DISTRIBUTION_NAME = "cp-moakb"
PACKAGE_VERSION = "0.1.0"
PYTHON_REQUIREMENT = "<3.13,>=3.11"
EXPECTED_DEPENDENCIES = (
    "pandas==3.0.3",
    "pdfplumber==0.11.10",
    "PyYAML==6.0.3",
    'fastapi==0.139.2; extra == "http"',
    'black==26.5.1; extra == "dev"',
    'build==1.5.0; extra == "dev"',
    'fastapi==0.139.2; extra == "dev"',
    'httpx2==2.7.0; extra == "dev"',
    'mypy==2.2.0; extra == "dev"',
    'packaging==26.2; extra == "dev"',
    'pre-commit==4.6.0; extra == "dev"',
    'pytest==9.1.1; extra == "dev"',
    'ruff==0.15.20; extra == "dev"',
    'setuptools==83.0.0; extra == "dev"',
    'types-PyYAML==6.0.12.20260518; extra == "dev"',
)
FORBIDDEN_SUFFIXES = (
    ".csv",
    ".db",
    ".pdf",
    ".pyc",
    ".sqlite",
    ".sqlite3",
)
FORBIDDEN_PARTS = frozenset(
    {
        ".git",
        ".github",
        ".mypy_cache",
        ".pytest_cache",
        ".ruff_cache",
        ".venv",
        "__pycache__",
        "examples",
        "references",
        "tests",
        "tmp",
    }
)


class DistributionContractError(RuntimeError):
    """A built distribution violates RAS-012."""


def _artifacts(directory: Path) -> tuple[Path, Path]:
    wheels = sorted(directory.glob("*.whl"))
    sdists = sorted(directory.glob("*.tar.gz"))
    if len(wheels) != 1 or len(sdists) != 1:
        raise DistributionContractError(
            "distribution directory must contain exactly one wheel and one sdist"
        )
    return wheels[0], sdists[0]


def _normalized_names(names: Iterable[str], *, sdist: bool) -> tuple[str, ...]:
    normalized: list[str] = []
    for raw_name in names:
        path = PurePosixPath(raw_name)
        parts = path.parts[1:] if sdist else path.parts
        if not parts or raw_name.endswith("/"):
            continue
        normalized.append(PurePosixPath(*parts).as_posix())
    return tuple(sorted(normalized))


def _wheel_digests(archive: zipfile.ZipFile) -> tuple[tuple[str, str], ...]:
    return tuple(
        sorted(
            (name, hashlib.sha256(archive.read(name)).hexdigest())
            for name in archive.namelist()
            if not name.endswith("/")
        )
    )


def _sdist_digests(archive: tarfile.TarFile) -> tuple[tuple[str, str], ...]:
    values: list[tuple[str, str]] = []
    for member in archive.getmembers():
        if not member.isfile():
            continue
        extracted = archive.extractfile(member)
        if extracted is None:
            raise DistributionContractError("unable to read sdist member")
        normalized = PurePosixPath(*PurePosixPath(member.name).parts[1:]).as_posix()
        values.append((normalized, hashlib.sha256(extracted.read()).hexdigest()))
    return tuple(sorted(values))


def _reject_forbidden(names: tuple[str, ...]) -> None:
    for name in names:
        path = PurePosixPath(name)
        lowered = name.casefold()
        if FORBIDDEN_PARTS.intersection(part.casefold() for part in path.parts):
            raise DistributionContractError(f"forbidden artifact path: {name}")
        if lowered.endswith(FORBIDDEN_SUFFIXES):
            raise DistributionContractError(f"forbidden artifact file: {name}")
        if any(
            part.casefold() in {"data", "docs", "examples", "validation"}
            for part in path.parts[:1]
        ):
            raise DistributionContractError(f"forbidden top-level source path: {name}")


def _wheel_metadata(archive: zipfile.ZipFile) -> bytes:
    matches = sorted(
        name for name in archive.namelist() if name.endswith(".dist-info/METADATA")
    )
    if len(matches) != 1:
        raise DistributionContractError("wheel must contain exactly one METADATA file")
    return archive.read(matches[0])


def _verify_metadata(raw: bytes) -> None:
    metadata = BytesParser(policy=default).parsebytes(raw)
    if metadata["Name"] != DISTRIBUTION_NAME:
        raise DistributionContractError("wheel distribution name mismatch")
    if metadata["Version"] != PACKAGE_VERSION:
        raise DistributionContractError("wheel package version mismatch")
    if metadata["Requires-Python"] != PYTHON_REQUIREMENT:
        raise DistributionContractError("wheel Python requirement mismatch")
    if metadata["License-Expression"] != "Apache-2.0":
        raise DistributionContractError("wheel license expression mismatch")
    requirements = tuple(metadata.get_all("Requires-Dist", ()))
    if requirements != EXPECTED_DEPENDENCIES:
        raise DistributionContractError("wheel dependency metadata mismatch")
    if any(
        "uvicorn" in value.casefold() or "gunicorn" in value.casefold()
        for value in requirements
    ):
        raise DistributionContractError("production server dependency is prohibited")


def verify(
    directory: Path,
) -> tuple[
    tuple[str, ...],
    tuple[str, ...],
    bytes,
    tuple[tuple[str, str], ...],
    tuple[tuple[str, str], ...],
]:
    """Return stable content lists after verifying one wheel and one sdist."""

    wheel, sdist = _artifacts(directory)
    with zipfile.ZipFile(wheel) as archive:
        wheel_names = _normalized_names(archive.namelist(), sdist=False)
        metadata = _wheel_metadata(archive)
        wheel_digests = _wheel_digests(archive)
    with tarfile.open(sdist, mode="r:gz") as archive:
        sdist_names = _normalized_names(
            (member.name for member in archive.getmembers() if member.isfile()),
            sdist=True,
        )
        sdist_digests = _sdist_digests(archive)

    _reject_forbidden(wheel_names)
    _reject_forbidden(sdist_names)
    required_wheel = {
        "cpmoakb/__init__.py",
        "cpmoakb/_version.py",
        "cpmoakb/composition/__init__.py",
        "cpmoakb/database/schema.sql",
    }
    required_sdist = required_wheel | {"LICENSE", "README.md", "pyproject.toml"}
    if not required_wheel <= set(wheel_names):
        raise DistributionContractError("wheel is missing required runtime files")
    if not required_sdist <= set(sdist_names):
        raise DistributionContractError("sdist is missing required source files")
    _verify_metadata(metadata)
    return wheel_names, sdist_names, metadata, wheel_digests, sdist_digests


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dist-dir", type=Path, default=Path("dist"))
    parser.add_argument("--compare-dir", type=Path)
    arguments = parser.parse_args()
    primary = verify(arguments.dist_dir)
    if arguments.compare_dir is not None:
        comparison = verify(arguments.compare_dir)
        if primary != comparison:
            raise DistributionContractError(
                "repeated build paths, metadata, or member content are not deterministic"
            )
    print(f"verified wheel files: {len(primary[0])}")
    print(f"verified sdist files: {len(primary[1])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

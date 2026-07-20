from __future__ import annotations

from scripts.verify_documentation import verify


def test_documentation_contract_passes() -> None:
    paths = verify()
    assert len(paths) >= 75
    assert paths == tuple(sorted(paths, key=lambda path: path.as_posix()))

from __future__ import annotations

from pathlib import Path

from scripts.verify_security_contract import EXCLUDED_FILES, verify


def test_governed_runtime_ast_contract_passes_with_one_frozen_exclusion() -> None:
    governed = verify()
    assert len(governed) == 74
    assert EXCLUDED_FILES == frozenset({Path("cpmoakb/validation/irac_validator.py")})


def test_security_verifier_is_deterministic() -> None:
    assert verify() == verify()

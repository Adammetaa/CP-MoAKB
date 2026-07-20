from __future__ import annotations

from scripts.verify_release_readiness import (
    ACTION_PINS,
    ALLOWED_FROZEN_CSV,
    EXPECTED_VERSIONS,
    authoritative_versions,
    verify,
)


def test_repository_release_readiness_contract_passes() -> None:
    assert len(verify()) == 13


def test_versions_and_narrow_allowlists_are_exact() -> None:
    assert authoritative_versions() == EXPECTED_VERSIONS
    assert ALLOWED_FROZEN_CSV == frozenset(
        {
            "validation/Active_Ingredient.csv",
            "validation/Chemical_Class.csv",
            "validation/MoA_Group.csv",
        }
    )
    assert ACTION_PINS == {
        "actions/checkout": (
            "9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0",
            "v7",
        ),
        "actions/setup-python": (
            "ece7cb06caefa5fff74198d8649806c4678c61a1",
            "v6",
        ),
    }

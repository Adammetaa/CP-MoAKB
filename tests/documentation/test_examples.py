from __future__ import annotations

from scripts.verify_examples import EXPECTED_IDS, load_manifest, verify


def test_example_manifest_is_exact_and_uses_public_packages() -> None:
    manifest = load_manifest()
    entries = manifest["examples"]
    assert tuple(entry["id"] for entry in entries) == EXPECTED_IDS
    assert all(entry["public_apis"] for entry in entries)
    assert all(
        package.startswith("cpmoakb")
        for entry in entries
        for package in entry["public_apis"]
    )


def test_all_examples_execute_deterministically() -> None:
    assert verify() == EXPECTED_IDS

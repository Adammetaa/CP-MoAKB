import pytest

from cpmoakb.domain import AuthorityIdentifier, AuthorityReference, DomainError


def test_authority_is_claim_scoped_and_versionable():
    authority = AuthorityReference(
        AuthorityIdentifier("fictional-authority"),
        "Fictional Standards Office",
        "Synthetic classification labels only.",
        jurisdiction="Example Jurisdiction",
        version="2026-test",
        canonical_locator="https://example.invalid/authority",
    )

    assert authority.scope_note == "Synthetic classification labels only."
    assert not hasattr(authority, "trust_score")


def test_authority_rejects_relative_locator():
    with pytest.raises(DomainError):
        AuthorityReference(
            AuthorityIdentifier("fictional"),
            "Fictional Authority",
            "Synthetic scope.",
            canonical_locator="local",
        )

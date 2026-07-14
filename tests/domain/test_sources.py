from datetime import date

import pytest

from cpmoakb.domain import (
    AuthorityIdentifier,
    DomainError,
    SourceIdentifier,
    SourceReference,
)


def test_source_keeps_dates_authorities_and_reuse_notes_explicit():
    source = SourceReference(
        SourceIdentifier("synthetic-source"),
        "Synthetic Reference",
        "Fictional Publisher",
        "test publication",
        "https://example.invalid/source",
        "Synthetic model construction only.",
        publication_date=date(2026, 1, 1),
        accessed_date=date(2026, 1, 2),
        authority_ids=(AuthorityIdentifier("z"), AuthorityIdentifier("a")),
        reuse_status_note="Fictional content; test use only.",
        archival_status="synthetic snapshot",
    )

    assert source.authority_ids == (AuthorityIdentifier("a"), AuthorityIdentifier("z"))
    assert source.publication_date == date(2026, 1, 1)


def test_unknown_source_dates_remain_absent():
    source = SourceReference(
        SourceIdentifier("synthetic-source"),
        "Synthetic Reference",
        "Fictional Publisher",
        "test publication",
        "https://example.invalid/source",
        "Synthetic scope.",
    )
    assert source.publication_date is None
    assert source.accessed_date is None


def test_source_rejects_non_uri_locator():
    with pytest.raises(DomainError):
        SourceReference(
            SourceIdentifier("synthetic-source"),
            "Synthetic Reference",
            "Fictional Publisher",
            "test publication",
            "not-a-uri",
            "Synthetic scope.",
        )

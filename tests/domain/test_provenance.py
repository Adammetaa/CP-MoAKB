from dataclasses import FrozenInstanceError
from datetime import date, datetime, timezone

import pytest

from cpmoakb.domain import (
    CandidateIdentifier,
    CreationProvenance,
    Provenance,
    ReviewProvenance,
    SourceIdentifier,
    SupersessionProvenance,
)


def test_provenance_preserves_separate_creation_review_and_source_parts():
    creation = CreationProvenance(
        datetime(2026, 1, 1, tzinfo=timezone.utc), "synthetic-curator-role"
    )
    review = ReviewProvenance(
        date(2026, 1, 2), "synthetic-reviewer-role", "Synthetic review only."
    )
    supersession = SupersessionProvenance(
        CandidateIdentifier("CPM-CAND-E-900010"), "Synthetic correction scenario."
    )
    provenance = Provenance(
        creation,
        source_ids=(SourceIdentifier("source-b"), SourceIdentifier("source-a")),
        evidence_ids=("EV-2", "EV-1"),
        reviews=(review,),
        editorial_note="No personal name required.",
        supersession=supersession,
        change_reason="Synthetic lifecycle exercise.",
    )

    assert provenance.source_ids == (
        SourceIdentifier("source-a"),
        SourceIdentifier("source-b"),
    )
    assert provenance.evidence_ids == ("EV-1", "EV-2")
    assert provenance.reviews == (review,)
    with pytest.raises(FrozenInstanceError):
        provenance.editorial_note = "changed"  # type: ignore[misc]


def test_review_provenance_orders_dates_and_datetimes_deterministically():
    later = ReviewProvenance(
        datetime(2026, 1, 3, tzinfo=timezone.utc), "synthetic-reviewer-b"
    )
    earlier = ReviewProvenance(date(2026, 1, 2), "synthetic-reviewer-a")

    provenance = Provenance(
        CreationProvenance(date(2026, 1, 1), "synthetic-curator-role"),
        reviews=(later, earlier),
    )

    assert provenance.reviews == (earlier, later)

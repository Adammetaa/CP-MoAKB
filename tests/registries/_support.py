"""Fictional domain values shared by registry tests."""

from __future__ import annotations

from datetime import date

from cpmoakb.domain import (
    AuthorityIdentifier,
    AuthorityReference,
    CandidateIdentifier,
    CreationProvenance,
    EntityRecord,
    Label,
    LabelSet,
    LabelStatus,
    Provenance,
    RecordKind,
    RecordLifecycle,
    SourceIdentifier,
    SourceReference,
)


def candidate_id(number: int, kind: str = "E") -> CandidateIdentifier:
    return CandidateIdentifier(f"CPM-CAND-{kind}-{number:06d}")


def source(key: str = "synthetic-source-a") -> SourceReference:
    return SourceReference(
        identifier=SourceIdentifier(key),
        title="Fictional Reference Alpha",
        issuing_organization="Synthetic Documentation Group",
        source_type="fictional-reference",
        canonical_locator="urn:synthetic:source:alpha",
        scope_note="Synthetic registry test material only.",
        version="1.0",
    )


def authority(key: str = "synthetic-authority-a") -> AuthorityReference:
    return AuthorityReference(
        identifier=AuthorityIdentifier(key),
        name="Fictional Authority Alpha",
        scope_note="Synthetic claim scope only.",
        canonical_locator="urn:synthetic:authority:alpha",
    )


def entity(number: int) -> EntityRecord:
    return EntityRecord(
        identifier=candidate_id(number),
        record_kind=RecordKind.ENTITY,
        domain_type="SyntheticRegistryConcept",
        lifecycle=RecordLifecycle.CANDIDATE,
        labels=LabelSet(
            (
                Label(
                    language="en",
                    text=f"Fictional Registry Entity {number}",
                    status=LabelStatus.PROVISIONAL,
                    preferred=True,
                ),
            )
        ),
        scope_note="Synthetic entity for explicit registry integration testing.",
        source_ids=(),
        evidence=(),
        provenance=Provenance(
            creation=CreationProvenance(date(2026, 1, 1), "synthetic-role")
        ),
    )

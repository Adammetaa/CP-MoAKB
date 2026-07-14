"""Fictional domain objects used only by query tests."""

from __future__ import annotations

from datetime import date

from cpmoakb.domain import (
    AuthorityIdentifier,
    AuthorityReference,
    CandidateIdentifier,
    CreationProvenance,
    EntityRecord,
    ExternalIdentifier,
    Label,
    LabelSet,
    LabelStatus,
    Provenance,
    RecordKind,
    RecordLifecycle,
    RelationshipRecord,
    SourceIdentifier,
    SourceReference,
)


def candidate_id(number: int, kind: str = "E") -> CandidateIdentifier:
    return CandidateIdentifier(f"CPM-CAND-{kind}-{number:06d}")


def source_reference(key: str = "synthetic-source-a") -> SourceReference:
    return SourceReference(
        identifier=SourceIdentifier(key),
        title="Fictional Query Reference",
        issuing_organization="Synthetic Query Group",
        source_type="fictional-reference",
        canonical_locator=f"urn:synthetic:query-source:{key}",
        scope_note="Synthetic query testing only.",
    )


def authority_reference(key: str = "synthetic-authority-a") -> AuthorityReference:
    return AuthorityReference(
        identifier=AuthorityIdentifier(key),
        name="Fictional Query Authority",
        scope_note="Synthetic query testing only.",
        canonical_locator=f"urn:synthetic:query-authority:{key}",
    )


def provenance() -> Provenance:
    return Provenance(
        creation=CreationProvenance(date(2026, 1, 1), "synthetic-query-role")
    )


def entity(
    number: int,
    *,
    preferred_text: str = "Fictional Widget",
    alternative_text: str = "Imaginary Widget",
    preferred_language: str = "en",
    preferred_locale: str | None = None,
    domain_type: str = "SyntheticConcept",
    lifecycle: RecordLifecycle = RecordLifecycle.CANDIDATE,
    external_value: str | None = None,
    source_key: str | None = None,
    authority_key: str | None = None,
) -> EntityRecord:
    source = source_reference(source_key) if source_key else None
    authority = authority_reference(authority_key) if authority_key else None
    external = (
        ExternalIdentifier("synthetic-catalog", external_value)
        if external_value
        else None
    )
    return EntityRecord(
        identifier=candidate_id(number),
        record_kind=RecordKind.ENTITY,
        domain_type=domain_type,
        lifecycle=lifecycle,
        labels=LabelSet(
            (
                Label(
                    language=preferred_language,
                    locale=preferred_locale,
                    text=preferred_text,
                    status=LabelStatus.PROVISIONAL,
                    preferred=True,
                ),
                Label(
                    language="en",
                    text=alternative_text,
                    status=LabelStatus.PROVISIONAL,
                    preferred=False,
                ),
            )
        ),
        scope_note="Synthetic entity for query tests.",
        source_ids=(source.identifier,) if source else (),
        evidence=(),
        provenance=provenance(),
        external_identifiers=(external,) if external else (),
        authorities=(authority,) if authority else (),
        sources=(source,) if source else (),
    )


def relationship(
    number: int,
    *,
    subject: CandidateIdentifier,
    object_: CandidateIdentifier,
    predicate: str = "synthetic_link",
) -> RelationshipRecord:
    return RelationshipRecord(
        identifier=candidate_id(number, "R"),
        record_kind=RecordKind.RELATIONSHIP,
        domain_type="SyntheticRelationship",
        lifecycle=RecordLifecycle.CANDIDATE,
        labels=LabelSet(
            (
                Label(
                    language="en",
                    text=f"Fictional Link {number}",
                    status=LabelStatus.PROVISIONAL,
                    preferred=True,
                ),
            )
        ),
        scope_note="Synthetic relationship for one-edge query tests.",
        source_ids=(),
        evidence=(),
        provenance=provenance(),
        subject_id=subject,
        predicate=predicate,
        object_id=object_,
    )

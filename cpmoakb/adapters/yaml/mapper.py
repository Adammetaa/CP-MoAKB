"""Lossless mapping from the supported representation into Runtime Core models."""

from __future__ import annotations

from collections.abc import Callable, Mapping, Sequence
from datetime import date, datetime
from typing import TypeVar, cast

from cpmoakb.domain import (
    AuthorityIdentifier,
    AuthorityReference,
    CandidateIdentifier,
    CandidateRecord,
    ClassificationReference,
    CreationProvenance,
    DomainError,
    EntityRecord,
    EvidenceReference,
    EvidenceRole,
    ExternalIdentifier,
    Label,
    LabelSet,
    LabelStatus,
    Provenance,
    RecordKind,
    RecordLifecycle,
    RelationshipRecord,
    ReviewProvenance,
    ScientificName,
    SourceIdentifier,
    SourceReference,
    SupersessionProvenance,
)

from .errors import YamlMappingError
from .schema import validate_candidate_document, validate_schema_version

_T = TypeVar("_T")


def _construct(path: str, factory: Callable[[], _T]) -> _T:
    try:
        return factory()
    except (DomainError, ValueError) as error:
        raise YamlMappingError(str(error), path=path) from error


def _mapping(value: object) -> Mapping[str, object]:
    return cast(Mapping[str, object], value)


def _list(value: object | None) -> Sequence[object]:
    return cast(Sequence[object], value or [])


def _optional_string(mapping: Mapping[str, object], key: str) -> str | None:
    value = mapping.get(key)
    return cast(str | None, value)


def _external(value: object, path: str) -> ExternalIdentifier:
    item = _mapping(value)
    return _construct(
        path,
        lambda: ExternalIdentifier(
            cast(str, item["authority"]),
            cast(str, item["value"]),
            _optional_string(item, "resolver_uri"),
        ),
    )


def _authority(value: object, path: str) -> AuthorityReference:
    item = _mapping(value)
    return _construct(
        path,
        lambda: AuthorityReference(
            AuthorityIdentifier(cast(str, item["identifier"])),
            cast(str, item["name"]),
            cast(str, item["scope_note"]),
            jurisdiction=_optional_string(item, "jurisdiction"),
            version=_optional_string(item, "version"),
            canonical_locator=_optional_string(item, "canonical_locator"),
        ),
    )


def _date(value: str, path: str) -> date:
    return _construct(path, lambda: date.fromisoformat(value))


def _temporal(value: str, path: str) -> date | datetime:
    if "T" in value:
        return _construct(path, lambda: datetime.fromisoformat(value))
    return _date(value, path)


def _authority_identifier(value: object, path: str) -> AuthorityIdentifier:
    return _construct(path, lambda: AuthorityIdentifier(cast(str, value)))


def _source(value: object, path: str) -> SourceReference:
    item = _mapping(value)
    publication = _optional_string(item, "publication_date")
    accessed = _optional_string(item, "accessed_date")
    authority_ids = tuple(
        _authority_identifier(raw, f"{path}.authority_ids[{index}]")
        for index, raw in enumerate(_list(item.get("authority_ids")))
    )
    return _construct(
        path,
        lambda: SourceReference(
            SourceIdentifier(cast(str, item["identifier"])),
            cast(str, item["title"]),
            cast(str, item["issuing_organization"]),
            cast(str, item["source_type"]),
            cast(str, item["canonical_locator"]),
            cast(str, item["scope_note"]),
            publication_date=(
                _date(publication, f"{path}.publication_date") if publication else None
            ),
            accessed_date=(
                _date(accessed, f"{path}.accessed_date") if accessed else None
            ),
            version=_optional_string(item, "version"),
            authority_ids=authority_ids,
            reuse_status_note=_optional_string(item, "reuse_status_note"),
            archival_status=_optional_string(item, "archival_status"),
        ),
    )


def _evidence(value: object, path: str) -> EvidenceReference:
    item = _mapping(value)
    role = _construct(f"{path}.role", lambda: EvidenceRole(cast(str, item["role"])))
    return _construct(
        path,
        lambda: EvidenceReference(
            cast(str, item["identifier"]),
            SourceIdentifier(cast(str, item["source_id"])),
            cast(str, item["locator"]),
            cast(str, item["note"]),
            role,
            language=_optional_string(item, "language"),
            uncertainty_note=_optional_string(item, "uncertainty_note"),
            reviewer_status=_optional_string(item, "reviewer_status"),
        ),
    )


def _label(value: object, path: str) -> Label:
    item = _mapping(value)
    status = _construct(
        f"{path}.status", lambda: LabelStatus(cast(str, item["status"]))
    )
    source_value = _optional_string(item, "source_id")
    source_id = (
        _construct(f"{path}.source_id", lambda: SourceIdentifier(source_value))
        if source_value
        else None
    )
    return _construct(
        path,
        lambda: Label(
            cast(str, item["language"]),
            cast(str, item["text"]),
            status,
            cast(bool, item["preferred"]),
            locale=_optional_string(item, "locale"),
            source_id=source_id,
            editorial_note=_optional_string(item, "editorial_note"),
            ambiguity_note=_optional_string(item, "ambiguity_note"),
        ),
    )


def _source_identifier(value: object, path: str) -> SourceIdentifier:
    return _construct(path, lambda: SourceIdentifier(cast(str, value)))


def _review_provenance(review: Mapping[str, object], path: str) -> ReviewProvenance:
    return _construct(
        path,
        lambda: ReviewProvenance(
            _temporal(cast(str, review["reviewed_at"]), f"{path}.reviewed_at"),
            cast(str, review["reviewer_role"]),
            _optional_string(review, "decision_note"),
        ),
    )


def _provenance(value: object, path: str) -> Provenance:
    item = _mapping(value)
    creation_data = _mapping(item["creation"])
    creation = _construct(
        f"{path}.creation",
        lambda: CreationProvenance(
            _temporal(
                cast(str, creation_data["created_at"]), f"{path}.creation.created_at"
            ),
            cast(str, creation_data["created_by"]),
        ),
    )
    source_ids = tuple(
        _source_identifier(raw, f"{path}.source_ids[{index}]")
        for index, raw in enumerate(_list(item.get("source_ids")))
    )
    evidence_ids = tuple(cast(str, raw) for raw in _list(item.get("evidence_ids")))
    reviews: list[ReviewProvenance] = []
    for index, raw in enumerate(_list(item.get("reviews"))):
        review = _mapping(raw)
        review_path = f"{path}.reviews[{index}]"
        reviews.append(_review_provenance(review, review_path))
    supersession: SupersessionProvenance | None = None
    if "supersession" in item:
        raw_supersession = _mapping(item["supersession"])
        supersession = _construct(
            f"{path}.supersession",
            lambda: SupersessionProvenance(
                CandidateIdentifier(cast(str, raw_supersession["predecessor_id"])),
                cast(str, raw_supersession["change_reason"]),
            ),
        )
    return _construct(
        path,
        lambda: Provenance(
            creation,
            source_ids=source_ids,
            evidence_ids=evidence_ids,
            reviews=tuple(reviews),
            editorial_note=_optional_string(item, "editorial_note"),
            supersession=supersession,
            change_reason=_optional_string(item, "change_reason"),
        ),
    )


def _scientific_name(value: object, path: str) -> ScientificName:
    item = _mapping(value)
    authority = (
        _authority(item["authority"], f"{path}.authority")
        if "authority" in item
        else None
    )
    external = (
        _external(item["external_identifier"], f"{path}.external_identifier")
        if "external_identifier" in item
        else None
    )
    return _construct(
        path,
        lambda: ScientificName(
            cast(str, item["name"]),
            authorship=_optional_string(item, "authorship"),
            authority=authority,
            external_identifier=external,
            verification_status=cast(str, item["verification_status"]),
            name_status=cast(str, item["name_status"]),
        ),
    )


def _classification(value: object, path: str) -> ClassificationReference:
    item = _mapping(value)
    return _construct(
        path,
        lambda: ClassificationReference(
            cast(str, item["scheme"]),
            cast(str, item["code"]),
            _optional_string(item, "label"),
        ),
    )


def _candidate_identifier(
    value: str, path: str, kind: RecordKind
) -> CandidateIdentifier:
    identifier = _construct(path, lambda: CandidateIdentifier(value))
    if identifier.kind is not kind:
        raise YamlMappingError(
            f"identifier must use the {kind.value} candidate form", path=path
        )
    return identifier


def map_candidate_document(document: Mapping[str, object]) -> CandidateRecord:
    """Validate schema 1.0 and construct exactly one immutable candidate record."""

    validate_schema_version(document)
    validate_candidate_document(document)
    kind = _construct(
        "$.record_kind", lambda: RecordKind(cast(str, document["record_kind"]))
    )
    lifecycle = _construct(
        "$.lifecycle", lambda: RecordLifecycle(cast(str, document["lifecycle"]))
    )
    identifier = _candidate_identifier(
        cast(str, document["candidate_id"]), "$.candidate_id", kind
    )
    labels = _construct(
        "$.labels",
        lambda: LabelSet(
            tuple(
                _label(item, f"$.labels[{index}]")
                for index, item in enumerate(_list(document["labels"]))
            )
        ),
    )
    authorities = tuple(
        _authority(item, f"$.authorities[{index}]")
        for index, item in enumerate(_list(document.get("authorities")))
    )
    sources = tuple(
        _source(item, f"$.sources[{index}]")
        for index, item in enumerate(_list(document.get("sources")))
    )
    evidence = tuple(
        _evidence(item, f"$.evidence[{index}]")
        for index, item in enumerate(_list(document.get("evidence")))
    )
    external_identifiers = tuple(
        _external(item, f"$.external_identifiers[{index}]")
        for index, item in enumerate(_list(document.get("external_identifiers")))
    )
    provenance = _provenance(document["provenance"], "$.provenance")
    ambiguity_notes = tuple(
        cast(str, item) for item in _list(document.get("ambiguity_notes"))
    )
    source_ids = tuple(source.identifier for source in sources)
    domain_type = cast(str, document["domain_type"])
    scope_note = cast(str, document["scope_note"])

    if kind is RecordKind.ENTITY:
        scientific_name = (
            _scientific_name(document["scientific_name"], "$.scientific_name")
            if "scientific_name" in document
            else None
        )
        classifications = tuple(
            _classification(item, f"$.classification[{index}]")
            for index, item in enumerate(_list(document.get("classification")))
        )
        return _construct(
            "$",
            lambda: EntityRecord(
                identifier,
                kind,
                domain_type,
                lifecycle,
                labels,
                scope_note,
                source_ids,
                evidence,
                provenance,
                ambiguity_notes=ambiguity_notes,
                external_identifiers=external_identifiers,
                authorities=authorities,
                sources=sources,
                scientific_name=scientific_name,
                classifications=classifications,
            ),
        )

    subject = _candidate_identifier(
        cast(str, document["subject_id"]), "$.subject_id", RecordKind.ENTITY
    )
    object_identifier = _candidate_identifier(
        cast(str, document["object_id"]), "$.object_id", RecordKind.ENTITY
    )
    return _construct(
        "$",
        lambda: RelationshipRecord(
            identifier,
            kind,
            domain_type,
            lifecycle,
            labels,
            scope_note,
            source_ids,
            evidence,
            provenance,
            ambiguity_notes=ambiguity_notes,
            external_identifiers=external_identifiers,
            authorities=authorities,
            sources=sources,
            subject_id=subject,
            predicate=cast(str, document["predicate"]),
            object_id=object_identifier,
            context_note=_optional_string(document, "context_note"),
            uncertainty_note=_optional_string(document, "uncertainty_note"),
        ),
    )

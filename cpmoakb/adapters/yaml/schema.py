"""Explicit representation contract for YAML candidate schema version 1.0."""

from __future__ import annotations

from collections.abc import Callable, Mapping, Sequence
from typing import cast

from .errors import YamlSchemaVersionError, YamlStructureError

SUPPORTED_SCHEMA_VERSIONS = frozenset({"1.0"})

_BASE_REQUIRED = {
    "schema_version",
    "candidate_id",
    "record_kind",
    "domain_type",
    "lifecycle",
    "labels",
    "scope_note",
    "provenance",
}
_BASE_OPTIONAL = {
    "external_identifiers",
    "authorities",
    "sources",
    "evidence",
    "ambiguity_notes",
}
_ENTITY_OPTIONAL = {"scientific_name", "classification"}
_RELATIONSHIP_REQUIRED = {"subject_id", "predicate", "object_id"}
_RELATIONSHIP_OPTIONAL = {"context_note", "uncertainty_note"}


def validate_schema_version(document: Mapping[str, object]) -> None:
    """Fail before structural mapping unless the exact string version is supported."""

    if "schema_version" not in document:
        raise YamlSchemaVersionError(
            "schema_version is required",
            path="$.schema_version",
            remediation_hint='set schema_version to the quoted string "1.0"',
        )
    version = document["schema_version"]
    if type(version) is not str:
        raise YamlSchemaVersionError(
            "schema_version must be a string",
            path="$.schema_version",
            remediation_hint='quote the supported version as "1.0"',
        )
    if version not in SUPPORTED_SCHEMA_VERSIONS:
        raise YamlSchemaVersionError(
            f"unsupported schema version {version!r}",
            path="$.schema_version",
            remediation_hint='use the explicitly supported version "1.0"; migration is not automatic',
        )


def _mapping(
    value: object,
    path: str,
    *,
    required: set[str],
    optional: set[str] | None = None,
) -> Mapping[str, object]:
    if not isinstance(value, Mapping):
        raise YamlStructureError("expected a mapping", path=path)
    mapping = cast(Mapping[str, object], value)
    allowed = required | (optional or set())
    unknown = sorted(set(mapping) - allowed)
    if unknown:
        key = unknown[0]
        raise YamlStructureError(f"unknown key {key!r}", path=f"{path}.{key}")
    missing = sorted(required - set(mapping))
    if missing:
        key = missing[0]
        raise YamlStructureError(
            f"required key {key!r} is missing", path=f"{path}.{key}"
        )
    return mapping


def _list(value: object, path: str, *, nonempty: bool = False) -> Sequence[object]:
    if not isinstance(value, list):
        raise YamlStructureError("expected a list", path=path)
    if nonempty and not value:
        raise YamlStructureError("list must not be empty", path=path)
    return value


def _string(value: object, path: str) -> str:
    if type(value) is not str:
        raise YamlStructureError("expected a string", path=path)
    result = cast(str, value)
    if not result or result != result.strip():
        raise YamlStructureError(
            "string must be non-empty and have no surrounding whitespace", path=path
        )
    return result


def _boolean(value: object, path: str) -> None:
    if type(value) is not bool:
        raise YamlStructureError("expected a boolean", path=path)


def _optional_strings(mapping: Mapping[str, object], keys: set[str], path: str) -> None:
    for key in sorted(keys & set(mapping)):
        _string(mapping[key], f"{path}.{key}")


def _string_list(value: object, path: str) -> None:
    values = _list(value, path)
    seen: set[str] = set()
    for index, item in enumerate(values):
        string = _string(item, f"{path}[{index}]")
        if string in seen:
            raise YamlStructureError("duplicate list value", path=f"{path}[{index}]")
        seen.add(string)


def _validate_external(value: object, path: str) -> None:
    mapping = _mapping(
        value,
        path,
        required={"authority", "value"},
        optional={"resolver_uri"},
    )
    _string(mapping["authority"], f"{path}.authority")
    _string(mapping["value"], f"{path}.value")
    _optional_strings(mapping, {"resolver_uri"}, path)


def _validate_authority(value: object, path: str) -> None:
    mapping = _mapping(
        value,
        path,
        required={"identifier", "name", "scope_note"},
        optional={"jurisdiction", "version", "canonical_locator"},
    )
    for key in ("identifier", "name", "scope_note"):
        _string(mapping[key], f"{path}.{key}")
    _optional_strings(mapping, {"jurisdiction", "version", "canonical_locator"}, path)


def _validate_label(value: object, path: str) -> None:
    mapping = _mapping(
        value,
        path,
        required={"language", "text", "status", "preferred"},
        optional={"locale", "source_id", "editorial_note", "ambiguity_note"},
    )
    for key in ("language", "text", "status"):
        _string(mapping[key], f"{path}.{key}")
    _boolean(mapping["preferred"], f"{path}.preferred")
    _optional_strings(
        mapping, {"locale", "source_id", "editorial_note", "ambiguity_note"}, path
    )


def _validate_source(value: object, path: str) -> None:
    mapping = _mapping(
        value,
        path,
        required={
            "identifier",
            "title",
            "issuing_organization",
            "source_type",
            "canonical_locator",
            "scope_note",
        },
        optional={
            "publication_date",
            "accessed_date",
            "version",
            "authority_ids",
            "reuse_status_note",
            "archival_status",
        },
    )
    for key in (
        "identifier",
        "title",
        "issuing_organization",
        "source_type",
        "canonical_locator",
        "scope_note",
    ):
        _string(mapping[key], f"{path}.{key}")
    _optional_strings(
        mapping,
        {
            "publication_date",
            "accessed_date",
            "version",
            "reuse_status_note",
            "archival_status",
        },
        path,
    )
    if "authority_ids" in mapping:
        _string_list(mapping["authority_ids"], f"{path}.authority_ids")


def _validate_evidence(value: object, path: str) -> None:
    mapping = _mapping(
        value,
        path,
        required={"identifier", "source_id", "locator", "note", "role"},
        optional={"language", "uncertainty_note", "reviewer_status"},
    )
    for key in ("identifier", "source_id", "locator", "note", "role"):
        _string(mapping[key], f"{path}.{key}")
    _optional_strings(
        mapping, {"language", "uncertainty_note", "reviewer_status"}, path
    )


def _validate_creation(value: object, path: str) -> None:
    mapping = _mapping(value, path, required={"created_at", "created_by"})
    _string(mapping["created_at"], f"{path}.created_at")
    _string(mapping["created_by"], f"{path}.created_by")


def _validate_review(value: object, path: str) -> None:
    mapping = _mapping(
        value,
        path,
        required={"reviewed_at", "reviewer_role"},
        optional={"decision_note"},
    )
    _string(mapping["reviewed_at"], f"{path}.reviewed_at")
    _string(mapping["reviewer_role"], f"{path}.reviewer_role")
    _optional_strings(mapping, {"decision_note"}, path)


def _validate_supersession(value: object, path: str) -> None:
    mapping = _mapping(value, path, required={"predecessor_id", "change_reason"})
    _string(mapping["predecessor_id"], f"{path}.predecessor_id")
    _string(mapping["change_reason"], f"{path}.change_reason")


def _validate_provenance(value: object, path: str) -> None:
    mapping = _mapping(
        value,
        path,
        required={"creation"},
        optional={
            "source_ids",
            "evidence_ids",
            "reviews",
            "editorial_note",
            "supersession",
            "change_reason",
        },
    )
    _validate_creation(mapping["creation"], f"{path}.creation")
    for key in ("source_ids", "evidence_ids"):
        if key in mapping:
            _string_list(mapping[key], f"{path}.{key}")
    if "reviews" in mapping:
        for index, item in enumerate(_list(mapping["reviews"], f"{path}.reviews")):
            _validate_review(item, f"{path}.reviews[{index}]")
    _optional_strings(mapping, {"editorial_note", "change_reason"}, path)
    if "supersession" in mapping:
        _validate_supersession(mapping["supersession"], f"{path}.supersession")


def _validate_scientific_name(value: object, path: str) -> None:
    mapping = _mapping(
        value,
        path,
        required={"name", "verification_status", "name_status"},
        optional={"authorship", "authority", "external_identifier"},
    )
    for key in ("name", "verification_status", "name_status"):
        _string(mapping[key], f"{path}.{key}")
    _optional_strings(mapping, {"authorship"}, path)
    if "authority" in mapping:
        _validate_authority(mapping["authority"], f"{path}.authority")
    if "external_identifier" in mapping:
        _validate_external(
            mapping["external_identifier"], f"{path}.external_identifier"
        )


def _validate_classification(value: object, path: str) -> None:
    mapping = _mapping(value, path, required={"scheme", "code"}, optional={"label"})
    _string(mapping["scheme"], f"{path}.scheme")
    _string(mapping["code"], f"{path}.code")
    _optional_strings(mapping, {"label"}, path)


def _validate_object_list(
    document: Mapping[str, object],
    key: str,
    validator: Callable[[object, str], None],
    unique_fields: tuple[str, ...],
) -> None:
    if key not in document:
        return
    values = _list(document[key], f"$.{key}")
    seen: set[tuple[object, ...]] = set()
    for index, item in enumerate(values):
        path = f"$.{key}[{index}]"
        validator(item, path)
        mapping = cast(Mapping[str, object], item)
        identity = tuple(mapping[field] for field in unique_fields)
        if identity in seen:
            raise YamlStructureError("duplicate list item", path=path)
        seen.add(identity)


def validate_candidate_document(document: Mapping[str, object]) -> None:
    """Validate every supported key and nested value before domain mapping."""

    validate_schema_version(document)
    if "record_kind" not in document:
        raise YamlStructureError(
            "required key 'record_kind' is missing", path="$.record_kind"
        )
    kind = _string(document["record_kind"], "$.record_kind")
    required = set(_BASE_REQUIRED)
    optional = set(_BASE_OPTIONAL)
    if kind == "entity":
        optional |= _ENTITY_OPTIONAL
    elif kind == "relationship":
        required |= _RELATIONSHIP_REQUIRED
        optional |= _RELATIONSHIP_OPTIONAL
    else:
        optional |= _ENTITY_OPTIONAL | _RELATIONSHIP_REQUIRED | _RELATIONSHIP_OPTIONAL
    mapping = _mapping(document, "$", required=required, optional=optional)

    for key in (
        "schema_version",
        "candidate_id",
        "record_kind",
        "domain_type",
        "lifecycle",
        "scope_note",
    ):
        _string(mapping[key], f"$.{key}")

    labels = _list(mapping["labels"], "$.labels", nonempty=True)
    for index, label in enumerate(labels):
        _validate_label(label, f"$.labels[{index}]")

    _validate_object_list(
        mapping, "external_identifiers", _validate_external, ("authority", "value")
    )
    _validate_object_list(mapping, "authorities", _validate_authority, ("identifier",))
    _validate_object_list(mapping, "sources", _validate_source, ("identifier",))
    _validate_object_list(mapping, "evidence", _validate_evidence, ("identifier",))
    _validate_provenance(mapping["provenance"], "$.provenance")

    if "ambiguity_notes" in mapping:
        _string_list(mapping["ambiguity_notes"], "$.ambiguity_notes")
    if "scientific_name" in mapping:
        _validate_scientific_name(mapping["scientific_name"], "$.scientific_name")
    _validate_object_list(
        mapping, "classification", _validate_classification, ("scheme", "code")
    )

    if kind == "entity":
        for prohibited in sorted(_RELATIONSHIP_REQUIRED | _RELATIONSHIP_OPTIONAL):
            if prohibited in mapping:
                raise YamlStructureError(
                    "relationship field is prohibited for an entity",
                    path=f"$.{prohibited}",
                )
    if kind == "relationship":
        for prohibited in sorted(_ENTITY_OPTIONAL):
            if prohibited in mapping:
                raise YamlStructureError(
                    "entity-only field is prohibited for a relationship",
                    path=f"$.{prohibited}",
                )
        for key in _RELATIONSHIP_REQUIRED:
            _string(mapping[key], f"$.{key}")
        _optional_strings(mapping, _RELATIONSHIP_OPTIONAL, "$")

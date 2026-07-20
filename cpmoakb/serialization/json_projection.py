"""Explicit, deterministic, output-only projections of selected Runtime values."""

from __future__ import annotations

import json
import math
from collections.abc import Sequence
from datetime import date
from typing import cast

from cpmoakb.domain import (
    AuthorityReference,
    ExternalIdentifier,
    SourceReference,
    ValidationIssue,
    ValidationResult,
)
from cpmoakb.explain import (
    Explanation,
    ExplanationFact,
    ExplanationLimitation,
    ExplanationReference,
)
from cpmoakb.query import QueryCriteria, QueryMatch, QueryResult
from cpmoakb.registries import (
    AuthorityRegistrySnapshot,
    CandidateIdentifierRegistryEntry,
    CandidateIdentifierRegistrySnapshot,
    SourceRegistrySnapshot,
)
from cpmoakb.runtime_api import RUNTIME_API_VERSION
from cpmoakb.validation import ValidationFinding

from .errors import ProjectionContractError, UnsupportedProjectionTypeError
from .types import JsonValue

RUNTIME_JSON_PROJECTION_VERSION = "1.0"
_PROJECTION_SCHEMA = "cpmoakb-runtime-json"
_KINDS = frozenset(
    {
        "validation-result",
        "registry-snapshot",
        "query-result",
        "structured-explanation",
    }
)
_ENVELOPE_KEYS = frozenset(
    {"projection_schema", "projection_version", "runtime_api_version", "kind", "data"}
)


def project_validation_result(
    value: ValidationResult | Sequence[ValidationIssue] | Sequence[ValidationFinding],
) -> dict[str, JsonValue]:
    """Project a domain result or a homogeneous collection of public issues/findings."""

    if isinstance(value, ValidationResult):
        issues: list[JsonValue] = [_validation_issue(issue) for issue in value.issues]
        data: JsonValue = {"is_valid": value.is_valid, "issues": issues}
        return _envelope("validation-result", data)
    if isinstance(value, (str, bytes)) or not isinstance(value, Sequence):
        raise UnsupportedProjectionTypeError("unsupported validation projection type")
    items = list(value)
    if all(isinstance(item, ValidationIssue) for item in items):
        ordered = sorted(
            cast(list[ValidationIssue], items), key=lambda item: item.sort_key
        )
        return _envelope(
            "validation-result",
            {
                "is_valid": all(item.severity.value != "error" for item in ordered),
                "issues": [_validation_issue(item) for item in ordered],
            },
        )
    if all(isinstance(item, ValidationFinding) for item in items):
        ordered_findings = sorted(
            cast(list[ValidationFinding], items),
            key=lambda item: (
                item.rule_id,
                item.node_identifier or "",
                item.parent_identifier or "",
                item.severity,
                item.message,
            ),
        )
        return _envelope(
            "validation-result",
            {
                "is_valid": not any(
                    item.severity == "error" for item in ordered_findings
                ),
                "issues": [_validation_finding(item) for item in ordered_findings],
            },
        )
    raise UnsupportedProjectionTypeError(
        "validation collections must contain one supported issue type"
    )


def project_registry_snapshot(
    value: (
        CandidateIdentifierRegistrySnapshot
        | SourceRegistrySnapshot
        | AuthorityRegistrySnapshot
    ),
) -> dict[str, JsonValue]:
    """Project one explicitly supported immutable registry snapshot."""

    if isinstance(value, CandidateIdentifierRegistrySnapshot):
        snapshot_type = "candidate-identifier"
        entries = [_candidate_registry_entry(entry) for entry in value.entries]
    elif isinstance(value, SourceRegistrySnapshot):
        snapshot_type = "source"
        entries = [_source_reference(entry) for entry in value.entries]
    elif isinstance(value, AuthorityRegistrySnapshot):
        snapshot_type = "authority"
        entries = [_authority_reference(entry) for entry in value.entries]
    else:
        raise UnsupportedProjectionTypeError("unsupported registry snapshot type")
    return _envelope(
        "registry-snapshot", {"registry_type": snapshot_type, "entries": entries}
    )


def project_query_result(value: QueryResult) -> dict[str, JsonValue]:
    """Project a governed query result without ranking or inferred record fields."""

    if not isinstance(value, QueryResult):
        raise UnsupportedProjectionTypeError("unsupported query projection type")
    return _envelope(
        "query-result",
        {
            "criteria": _query_criteria(value.criteria),
            "total_count": value.total_count,
            "matches": [_query_match(match) for match in value.matches],
        },
    )


def project_structured_explanation(value: Explanation) -> dict[str, JsonValue]:
    """Project the structured explanation model without invoking its renderer."""

    if not isinstance(value, Explanation):
        raise UnsupportedProjectionTypeError("unsupported explanation projection type")
    return _envelope(
        "structured-explanation",
        {
            "explanation_type": value.explanation_type.value,
            "availability": value.availability.value,
            "subject_reference": _optional_reference(value.subject_reference),
            "facts": [_explanation_fact(fact) for fact in value.facts],
            "supporting_references": [
                _explanation_reference(reference)
                for reference in value.supporting_references
            ],
            "limitations": [
                _explanation_limitation(limitation) for limitation in value.limitations
            ],
            "summary": value.summary,
        },
    )


def project_runtime_value(value: object) -> dict[str, JsonValue]:
    """Dispatch only across the four closed supported Runtime result categories."""

    if isinstance(value, ValidationResult):
        return project_validation_result(value)
    if isinstance(
        value,
        (
            CandidateIdentifierRegistrySnapshot,
            SourceRegistrySnapshot,
            AuthorityRegistrySnapshot,
        ),
    ):
        return project_registry_snapshot(value)
    if isinstance(value, QueryResult):
        return project_query_result(value)
    if isinstance(value, Explanation):
        return project_structured_explanation(value)
    if isinstance(value, Sequence) and not isinstance(value, (str, bytes)):
        return project_validation_result(value)  # type: ignore[arg-type]
    raise UnsupportedProjectionTypeError("unsupported Runtime projection type")


def to_canonical_json(value: object) -> str:
    """Return canonical JSON text for a supported Runtime value or valid envelope."""

    projected = (
        _copy_and_validate_envelope(value)
        if isinstance(value, dict)
        else project_runtime_value(value)
    )
    return json.dumps(
        projected,
        ensure_ascii=False,
        allow_nan=False,
        sort_keys=True,
        separators=(",", ":"),
    )


def _envelope(kind: str, data: JsonValue) -> dict[str, JsonValue]:
    if kind not in _KINDS:
        raise ProjectionContractError("unknown projection kind")
    return {
        "projection_schema": _PROJECTION_SCHEMA,
        "projection_version": RUNTIME_JSON_PROJECTION_VERSION,
        "runtime_api_version": RUNTIME_API_VERSION,
        "kind": kind,
        "data": data,
    }


def _validation_issue(issue: ValidationIssue) -> JsonValue:
    return {
        "rule": issue.code,
        "severity": issue.severity.value,
        "message": issue.message,
        "field": issue.field_path,
        "reference": str(issue.record_id) if issue.record_id is not None else None,
        "remediation_hint": issue.remediation_hint,
    }


def _validation_finding(finding: ValidationFinding) -> JsonValue:
    return {
        "rule": finding.rule_id,
        "severity": finding.severity,
        "message": finding.message,
        "node_reference": finding.node_identifier,
        "parent_reference": finding.parent_identifier,
    }


def _candidate_registry_entry(entry: CandidateIdentifierRegistryEntry) -> JsonValue:
    return {
        "identifier": str(entry.identifier),
        "state": entry.state.value,
        "record_id": str(entry.record_id) if entry.record_id is not None else None,
        "reservation_note": entry.reservation_note,
        "change_reason": entry.change_reason,
        "superseded_by": (
            str(entry.superseded_by) if entry.superseded_by is not None else None
        ),
        "actor_role": entry.actor_role,
    }


def _source_reference(source: SourceReference) -> JsonValue:
    return {
        "identifier": str(source.identifier),
        "title": source.title,
        "issuing_organization": source.issuing_organization,
        "source_type": source.source_type,
        "canonical_locator": source.canonical_locator,
        "scope_note": source.scope_note,
        "publication_date": _date_text(source.publication_date),
        "accessed_date": _date_text(source.accessed_date),
        "version": source.version,
        "authority_ids": [str(identifier) for identifier in source.authority_ids],
        "reuse_status_note": source.reuse_status_note,
        "archival_status": source.archival_status,
    }


def _authority_reference(authority: AuthorityReference) -> JsonValue:
    return {
        "identifier": str(authority.identifier),
        "name": authority.name,
        "scope_note": authority.scope_note,
        "jurisdiction": authority.jurisdiction,
        "version": authority.version,
        "canonical_locator": authority.canonical_locator,
    }


def _date_text(value: date | None) -> str | None:
    return value.isoformat() if value is not None else None


def _external_identifier(value: ExternalIdentifier | None) -> JsonValue:
    if value is None:
        return None
    return {
        "authority": value.authority,
        "value": value.value,
        "resolver_uri": value.resolver_uri,
    }


def _query_criteria(criteria: QueryCriteria) -> JsonValue:
    return {
        "identifier": str(criteria.identifier) if criteria.identifier else None,
        "record_kind": criteria.record_kind.value if criteria.record_kind else None,
        "domain_type": criteria.domain_type,
        "lifecycle": criteria.lifecycle.value if criteria.lifecycle else None,
        "label_text": criteria.label_text,
        "label_scope": criteria.label_scope.value,
        "language": criteria.language,
        "locale": criteria.locale,
        "match_mode": criteria.match_mode.value,
        "external_identifier": _external_identifier(criteria.external_identifier),
        "relationship_subject": (
            str(criteria.relationship_subject)
            if criteria.relationship_subject
            else None
        ),
        "relationship_object": (
            str(criteria.relationship_object) if criteria.relationship_object else None
        ),
        "predicate": criteria.predicate,
        "source_identifier": (
            str(criteria.source_identifier) if criteria.source_identifier else None
        ),
        "authority_identifier": (
            str(criteria.authority_identifier)
            if criteria.authority_identifier
            else None
        ),
    }


def _query_match(match: QueryMatch) -> JsonValue:
    return {
        "record_identifier": str(match.record.identifier),
        "matched_field": match.matched_field,
        "matched_value": match.matched_value,
        "match_mode": match.match_mode.value,
        "language": match.language,
        "locale": match.locale,
    }


def _optional_reference(reference: ExplanationReference | None) -> JsonValue:
    return _explanation_reference(reference) if reference is not None else None


def _explanation_reference(reference: ExplanationReference) -> JsonValue:
    return {
        "reference_type": reference.reference_type.value,
        "identifier": reference.identifier,
        "field_path": reference.field_path,
    }


def _explanation_fact(fact: ExplanationFact) -> JsonValue:
    return {
        "field_path": fact.field_path,
        "value": fact.value,
        "role": fact.role,
        "reference": _optional_reference(fact.reference),
    }


def _explanation_limitation(limitation: ExplanationLimitation) -> JsonValue:
    return {
        "code": limitation.code,
        "message": limitation.message,
        "missing_input": limitation.missing_input,
    }


def _copy_and_validate_envelope(value: dict[object, object]) -> dict[str, JsonValue]:
    if set(value) != _ENVELOPE_KEYS or not all(isinstance(key, str) for key in value):
        raise ProjectionContractError(
            "projection envelope fields do not match contract"
        )
    if value.get("projection_schema") != _PROJECTION_SCHEMA:
        raise ProjectionContractError("unknown projection schema")
    if value.get("projection_version") != RUNTIME_JSON_PROJECTION_VERSION:
        raise ProjectionContractError("unsupported projection version")
    if value.get("runtime_api_version") != RUNTIME_API_VERSION:
        raise ProjectionContractError("unsupported Runtime API version")
    if value.get("kind") not in _KINDS:
        raise ProjectionContractError("unknown projection kind")
    copied = _copy_json_value(value)
    if not isinstance(copied, dict):
        raise ProjectionContractError("projection envelope must be an object")
    return copied


def _copy_json_value(value: object) -> JsonValue:
    if value is None or isinstance(value, (str, bool, int)):
        return value
    if isinstance(value, float):
        if not math.isfinite(value):
            raise ProjectionContractError("non-finite numbers are not JSON compatible")
        return value
    if isinstance(value, list):
        return [_copy_json_value(item) for item in value]
    if isinstance(value, dict):
        if not all(isinstance(key, str) for key in value):
            raise ProjectionContractError("projection object keys must be strings")
        return {cast(str, key): _copy_json_value(item) for key, item in value.items()}
    raise ProjectionContractError("projection contains a non-JSON-compatible value")

from __future__ import annotations

import json
from datetime import date
from typing import Any, cast

import pytest

import cpmoakb.serialization as serialization
from cpmoakb.domain import (
    AuthorityIdentifier,
    AuthorityReference,
    CandidateIdentifier,
    SourceIdentifier,
    SourceReference,
    ValidationIssue,
    ValidationResult,
    ValidationSeverity,
)
from cpmoakb.explain import (
    Explanation,
    ExplanationAvailability,
    ExplanationFact,
    ExplanationLimitation,
    ExplanationReference,
    ExplanationReferenceType,
    ExplanationType,
    render_explanation,
)
from cpmoakb.query import QueryCriteria, QueryMatch, QueryResult, TextMatchMode
from cpmoakb.registries import (
    AuthorityRegistrySnapshot,
    CandidateIdentifierRegistryEntry,
    CandidateIdentifierRegistrySnapshot,
    CandidateIdentifierState,
    SourceRegistrySnapshot,
)
from cpmoakb.serialization import (
    ProjectionContractError,
    UnsupportedProjectionTypeError,
    project_query_result,
    project_registry_snapshot,
    project_structured_explanation,
    project_validation_result,
    to_canonical_json,
)
from cpmoakb.validation import ValidationFinding
from tests.query._support import entity


def _data(projected: object) -> dict[str, Any]:
    return cast(dict[str, Any], cast(dict[str, Any], projected)["data"])


def test_projection_version_and_public_exports_are_exact() -> None:
    assert serialization.RUNTIME_JSON_PROJECTION_VERSION == "1.0"
    assert set(serialization.__all__) == {
        "JsonScalar",
        "JsonValue",
        "ProjectionContractError",
        "RUNTIME_JSON_PROJECTION_VERSION",
        "SerializationError",
        "UnsupportedProjectionTypeError",
        "project_query_result",
        "project_registry_snapshot",
        "project_runtime_value",
        "project_structured_explanation",
        "project_validation_result",
        "to_canonical_json",
    }


def test_validation_result_has_exact_envelope_and_governed_issue_order() -> None:
    result = ValidationResult(
        (
            ValidationIssue("z-rule", ValidationSeverity.WARNING, "Second."),
            ValidationIssue(
                "a-rule",
                ValidationSeverity.ERROR,
                "First.",
                field_path="labels",
                record_id=CandidateIdentifier("CPM-CAND-E-990001"),
                remediation_hint="Supply a fictional label.",
            ),
        )
    )
    projected = project_validation_result(result)

    assert list(projected) == [
        "projection_schema",
        "projection_version",
        "runtime_api_version",
        "kind",
        "data",
    ]
    assert projected | {} == {
        "projection_schema": "cpmoakb-runtime-json",
        "projection_version": "1.0",
        "runtime_api_version": "0.1",
        "kind": "validation-result",
        "data": {
            "is_valid": False,
            "issues": [
                {
                    "rule": "a-rule",
                    "severity": "error",
                    "message": "First.",
                    "field": "labels",
                    "reference": "CPM-CAND-E-990001",
                    "remediation_hint": "Supply a fictional label.",
                },
                {
                    "rule": "z-rule",
                    "severity": "warning",
                    "message": "Second.",
                    "field": None,
                    "reference": None,
                    "remediation_hint": None,
                },
            ],
        },
    }
    assert "timestamp" not in to_canonical_json(result)


def test_validation_finding_collection_is_supported_without_invented_fields() -> None:
    projected = project_validation_result(
        [ValidationFinding("synthetic.rule", "warning", "Fictional warning.")]
    )
    assert projected["data"] == {
        "is_valid": True,
        "issues": [
            {
                "rule": "synthetic.rule",
                "severity": "warning",
                "message": "Fictional warning.",
                "node_reference": None,
                "parent_reference": None,
            }
        ],
    }


def test_registry_snapshots_are_explicit_ordered_and_isolated() -> None:
    candidate_snapshot = CandidateIdentifierRegistrySnapshot(
        (
            CandidateIdentifierRegistryEntry(
                CandidateIdentifier("CPM-CAND-E-990002"),
                CandidateIdentifierState.RESERVED,
                reservation_note="Fictional reservation two.",
            ),
            CandidateIdentifierRegistryEntry(
                CandidateIdentifier("CPM-CAND-E-990001"),
                CandidateIdentifierState.RESERVED,
                reservation_note="Fictional reservation one.",
            ),
        )
    )
    first = project_registry_snapshot(candidate_snapshot)
    first_data = _data(first)
    assert [entry["identifier"] for entry in first_data["entries"]] == [
        "CPM-CAND-E-990001",
        "CPM-CAND-E-990002",
    ]
    first_data["entries"][0]["identifier"] = "changed"
    assert project_registry_snapshot(candidate_snapshot) != first
    assert str(candidate_snapshot.entries[0].identifier) == "CPM-CAND-E-990001"

    source = SourceReference(
        SourceIdentifier("synthetic-source-z"),
        "Fictional Unicode แหล่งข้อมูล",
        "Synthetic Group",
        "fictional-reference",
        "urn:synthetic:source:z",
        "Synthetic projection testing only.",
        publication_date=date(2026, 1, 2),
        authority_ids=(AuthorityIdentifier("synthetic-authority-z"),),
    )
    source_data = _data(project_registry_snapshot(SourceRegistrySnapshot((source,))))
    assert source_data["entries"][0]["publication_date"] == "2026-01-02"

    authority = AuthorityReference(
        AuthorityIdentifier("synthetic-authority-z"),
        "Fictional Authority",
        "Synthetic scope only.",
    )
    authority_data = _data(
        project_registry_snapshot(AuthorityRegistrySnapshot((authority,)))
    )
    assert authority_data["registry_type"] == "authority"


def test_query_projection_retains_criteria_and_match_traceability_without_ranking() -> (
    None
):
    record = entity(990001, preferred_text="Fictional Unicode ข้อมูล")
    result = QueryResult(
        QueryCriteria(label_text="Fictional Unicode ข้อมูล"),
        (
            QueryMatch(
                record,
                "labels.preferred",
                "Fictional Unicode ข้อมูล",
                TextMatchMode.EXACT,
                "en",
            ),
        ),
    )
    projected = project_query_result(result)
    data = _data(projected)
    assert data["criteria"]["label_text"] == "Fictional Unicode ข้อมูล"
    assert data["matches"] == [
        {
            "record_identifier": "CPM-CAND-E-990001",
            "matched_field": "labels.preferred",
            "matched_value": "Fictional Unicode ข้อมูล",
            "match_mode": "exact",
            "language": "en",
            "locale": None,
        }
    ]
    assert "rank" not in to_canonical_json(result)
    assert "recommend" not in to_canonical_json(result)


def test_structured_explanation_retains_available_and_unavailable_structure() -> None:
    reference = ExplanationReference(
        ExplanationReferenceType.RECORD,
        "CPM-CAND-E-990001",
        "labels.preferred",
    )
    explanation = Explanation(
        ExplanationType.QUERY_MATCH,
        ExplanationAvailability.AVAILABLE,
        subject_reference=reference,
        facts=(
            ExplanationFact(
                "labels.preferred", "Fictional Widget", "matched-value", reference
            ),
        ),
        supporting_references=(reference,),
        summary="A fictional structured explanation.",
    )
    rendered_before = render_explanation(explanation)
    projected = project_structured_explanation(explanation)
    assert _data(projected)["facts"][0]["value"] == "Fictional Widget"
    assert render_explanation(explanation) == rendered_before

    unavailable = Explanation(
        ExplanationType.UNAVAILABLE,
        ExplanationAvailability.UNAVAILABLE,
        limitations=(
            ExplanationLimitation(
                "unsupported-request",
                "Scientific inference is unavailable.",
                "governed scientific assessment",
            ),
        ),
    )
    unavailable_data = _data(project_structured_explanation(unavailable))
    assert unavailable_data["availability"] == "unavailable"
    assert unavailable_data["limitations"]


def test_canonical_json_is_repeated_unicode_safe_and_compact() -> None:
    value = ValidationResult(
        (ValidationIssue("unicode", ValidationSeverity.WARNING, "ป้ายสมมติ"),)
    )
    first = to_canonical_json(value)
    assert first == to_canonical_json(value)
    assert "ป้ายสมมติ" in first
    assert "\n" not in first
    assert ": " not in first
    assert json.loads(first)["kind"] == "validation-result"


@pytest.mark.parametrize("value", [object(), "text", 7])
def test_unsupported_runtime_values_are_rejected_without_string_coercion(
    value: object,
) -> None:
    with pytest.raises(UnsupportedProjectionTypeError, match="unsupported"):
        to_canonical_json(value)


def test_unknown_kind_and_malformed_mapping_are_typed_failures() -> None:
    valid = project_validation_result(ValidationResult())
    unknown = valid | {"kind": "arbitrary"}
    with pytest.raises(ProjectionContractError, match="kind"):
        to_canonical_json(unknown)
    malformed = valid | {"data": {"unsafe": object()}}
    with pytest.raises(ProjectionContractError, match="non-JSON-compatible"):
        to_canonical_json(malformed)
    with pytest.raises(UnsupportedProjectionTypeError):
        project_validation_result(cast(Any, [object()]))


def test_canonical_json_copies_supplied_envelope_before_encoding() -> None:
    projected = project_validation_result(ValidationResult())
    before = project_validation_result(ValidationResult())
    assert to_canonical_json(projected) == to_canonical_json(before)
    assert projected == before

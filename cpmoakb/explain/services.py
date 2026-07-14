"""Coherent explicit API for structured explanation builders."""

from __future__ import annotations

from cpmoakb.domain import CandidateRecord, ValidationIssue
from cpmoakb.query import QueryCriteria, QueryMatch
from cpmoakb.registries import CandidateIdentifierRegistryEntry
from cpmoakb.validation import RuleMetadata

from .builders import (
    build_query_match_explanation,
    build_record_evidence_explanation,
    build_record_status_explanation,
    build_unavailable_explanation,
    build_validation_issue_explanation,
)
from .enums import UnavailableRequestType
from .models import Explanation


class ExplanationService:
    """Stateless facade; every explanation operation remains explicit."""

    def explain_query_match(
        self, match: QueryMatch, criteria: QueryCriteria
    ) -> Explanation:
        return build_query_match_explanation(match, criteria)

    def explain_validation_issue(
        self, issue: ValidationIssue, rule_metadata: RuleMetadata | None = None
    ) -> Explanation:
        return build_validation_issue_explanation(issue, rule_metadata)

    def explain_record_evidence(self, record: CandidateRecord) -> Explanation:
        return build_record_evidence_explanation(record)

    def explain_record_status(
        self,
        record: CandidateRecord,
        custody_entry: CandidateIdentifierRegistryEntry | None = None,
    ) -> Explanation:
        return build_record_status_explanation(record, custody_entry)

    def explain_unavailable(
        self, request_type: UnavailableRequestType, reason: str | None = None
    ) -> Explanation:
        return build_unavailable_explanation(request_type, reason)

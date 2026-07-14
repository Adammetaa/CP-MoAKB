"""Pure builders from explicit Runtime facts to structured explanations."""

from __future__ import annotations

from cpmoakb.domain import CandidateRecord, ValidationIssue
from cpmoakb.query import QueryCriteria, QueryMatch
from cpmoakb.registries import CandidateIdentifierRegistryEntry
from cpmoakb.validation import RuleMetadata

from .enums import (
    ExplanationAvailability,
    ExplanationReferenceType,
    ExplanationType,
    UnavailableRequestType,
)
from .errors import InvalidExplanationInputError, UnsupportedExplanationTargetError
from .models import (
    Explanation,
    ExplanationFact,
    ExplanationLimitation,
    ExplanationReference,
)


def _record_reference(record: CandidateRecord) -> ExplanationReference:
    return ExplanationReference(ExplanationReferenceType.RECORD, str(record.identifier))


def _criterion_facts(criteria: QueryCriteria) -> tuple[ExplanationFact, ...]:
    facts: list[ExplanationFact] = []
    values = (
        ("identifier", criteria.identifier),
        ("record_kind", criteria.record_kind.value if criteria.record_kind else None),
        ("domain_type", criteria.domain_type),
        ("lifecycle", criteria.lifecycle.value if criteria.lifecycle else None),
        ("label_text", criteria.label_text),
        ("label_scope", criteria.label_scope.value),
        ("language", criteria.language),
        ("locale", criteria.locale),
        ("external_identifier", criteria.external_identifier),
        ("relationship_subject", criteria.relationship_subject),
        ("relationship_object", criteria.relationship_object),
        ("predicate", criteria.predicate),
        ("source_identifier", criteria.source_identifier),
        ("authority_identifier", criteria.authority_identifier),
    )
    for field_name, value in values:
        if value is not None and not (
            field_name == "label_scope" and criteria.label_scope.value == "any"
        ):
            facts.append(
                ExplanationFact(
                    f"query.criteria.{field_name}", str(value), "query_criterion"
                )
            )
    return tuple(facts)


def build_query_match_explanation(
    match: QueryMatch, criteria: QueryCriteria
) -> Explanation:
    if not isinstance(match, QueryMatch) or not isinstance(criteria, QueryCriteria):
        raise UnsupportedExplanationTargetError(
            "query explanation requires QueryMatch and QueryCriteria"
        )
    record_ref = _record_reference(match.record)
    query_ref = ExplanationReference(
        ExplanationReferenceType.QUERY_FIELD,
        match.matched_field,
        match.matched_field,
    )
    facts = [
        ExplanationFact(
            "record.identifier", str(match.record.identifier), "subject", record_ref
        ),
        ExplanationFact(
            "query.matched_field", match.matched_field, "match_reason", query_ref
        ),
        ExplanationFact(
            "query.matched_value", match.matched_value, "match_reason", query_ref
        ),
        ExplanationFact(
            "query.match_mode", match.match_mode.value, "match_semantics", query_ref
        ),
        *_criterion_facts(criteria),
    ]
    if match.language is not None:
        facts.append(
            ExplanationFact(
                "query.language", match.language, "language_scope", query_ref
            )
        )
    if match.locale is not None:
        facts.append(
            ExplanationFact("query.locale", match.locale, "locale_scope", query_ref)
        )
    limitations: tuple[ExplanationLimitation, ...] = ()
    if match.matched_field.startswith("labels."):
        limitations = (
            ExplanationLimitation(
                "LABEL_MATCH_NOT_IDENTITY",
                "A matching label does not establish identity equivalence.",
            ),
        )
    return Explanation(
        ExplanationType.QUERY_MATCH,
        ExplanationAvailability.AVAILABLE,
        record_ref,
        tuple(facts),
        (record_ref, query_ref),
        limitations,
        f"Query match for {match.record.identifier} on {match.matched_field}.",
    )


def build_validation_issue_explanation(
    issue: ValidationIssue, rule_metadata: RuleMetadata | None = None
) -> Explanation:
    if not isinstance(issue, ValidationIssue):
        raise UnsupportedExplanationTargetError(
            "validation explanation requires ValidationIssue"
        )
    if rule_metadata is not None and rule_metadata.identifier != issue.code:
        raise InvalidExplanationInputError(
            f"rule metadata {rule_metadata.identifier} does not match issue {issue.code}"
        )
    rule_ref = ExplanationReference(
        ExplanationReferenceType.VALIDATION_RULE, issue.code
    )
    subject = (
        ExplanationReference(ExplanationReferenceType.RECORD, str(issue.record_id))
        if issue.record_id is not None
        else rule_ref
    )
    facts = [
        ExplanationFact("validation.rule_id", issue.code, "rule_trace", rule_ref),
        ExplanationFact(
            "validation.severity", issue.severity.value, "mechanical_severity", rule_ref
        ),
        ExplanationFact("validation.message", issue.message, "finding", rule_ref),
    ]
    if issue.record_id is not None:
        facts.append(
            ExplanationFact(
                "validation.record_id", str(issue.record_id), "subject", subject
            )
        )
    if issue.field_path is not None:
        facts.append(
            ExplanationFact(
                "validation.field_path", issue.field_path, "field_trace", rule_ref
            )
        )
    if issue.remediation_hint is not None:
        facts.append(
            ExplanationFact(
                "validation.remediation_hint",
                issue.remediation_hint,
                "supplied_remediation",
                rule_ref,
            )
        )
    if rule_metadata is not None:
        facts.extend(
            (
                ExplanationFact(
                    "validation.rule_name",
                    rule_metadata.name,
                    "rule_metadata",
                    rule_ref,
                ),
                ExplanationFact(
                    "validation.rule_layer",
                    rule_metadata.layer.value,
                    "rule_metadata",
                    rule_ref,
                ),
                ExplanationFact(
                    "validation.rule_version",
                    rule_metadata.version,
                    "rule_metadata",
                    rule_ref,
                ),
            )
        )
    return Explanation(
        ExplanationType.VALIDATION_ISSUE,
        ExplanationAvailability.AVAILABLE,
        subject,
        tuple(facts),
        tuple({subject, rule_ref}),
        (
            ExplanationLimitation(
                "MECHANICAL_VALIDATION_ONLY",
                "Validation severity is mechanical and does not establish scientific correctness or risk.",
            ),
        ),
        f"Validation issue {issue.code}.",
    )


def build_record_evidence_explanation(record: CandidateRecord) -> Explanation:
    if not isinstance(record, CandidateRecord):
        raise UnsupportedExplanationTargetError(
            "record evidence explanation requires CandidateRecord"
        )
    subject = _record_reference(record)
    facts: list[ExplanationFact] = [
        ExplanationFact(
            "record.identifier", str(record.identifier), "subject", subject
        ),
        ExplanationFact(
            "record.lifecycle", record.lifecycle.value, "governance_state", subject
        ),
        ExplanationFact(
            "provenance.creation.created_by",
            record.provenance.creation.created_by,
            "provenance_actor_role",
            subject,
        ),
        ExplanationFact(
            "provenance.creation.created_at",
            record.provenance.creation.created_at.isoformat(),
            "explicit_provenance_time",
            subject,
        ),
    ]
    references: set[ExplanationReference] = {subject}
    source_ids = set(record.source_ids) | {
        source.identifier for source in record.sources
    }
    for source_id in source_ids:
        reference = ExplanationReference(
            ExplanationReferenceType.SOURCE, str(source_id)
        )
        references.add(reference)
        facts.append(
            ExplanationFact(
                f"sources.{source_id}.identifier",
                str(source_id),
                "source_metadata_reference",
                reference,
            )
        )
    for evidence in record.evidence:
        reference = ExplanationReference(
            ExplanationReferenceType.EVIDENCE, evidence.identifier
        )
        source_ref = ExplanationReference(
            ExplanationReferenceType.SOURCE, str(evidence.source_id)
        )
        references.update((reference, source_ref))
        base = f"evidence.{evidence.identifier}"
        facts.extend(
            (
                ExplanationFact(
                    f"{base}.source_id",
                    str(evidence.source_id),
                    "evidence_source",
                    source_ref,
                ),
                ExplanationFact(
                    f"{base}.locator", evidence.locator, "evidence_locator", reference
                ),
                ExplanationFact(
                    f"{base}.role", evidence.role.value, "evidence_role", reference
                ),
                ExplanationFact(
                    f"{base}.note", evidence.note, "evidence_note", reference
                ),
            )
        )
        for field_name, value, role in (
            ("reviewer_status", evidence.reviewer_status, "explicit_review_status"),
            ("uncertainty_note", evidence.uncertainty_note, "explicit_uncertainty"),
            ("language", evidence.language, "explicit_language"),
        ):
            if value is not None:
                facts.append(
                    ExplanationFact(f"{base}.{field_name}", value, role, reference)
                )
    for index, review in enumerate(record.provenance.reviews):
        facts.append(
            ExplanationFact(
                f"provenance.reviews[{index}].reviewer_role",
                review.reviewer_role,
                "provenance_review_role",
                subject,
            )
        )
        if review.decision_note is not None:
            facts.append(
                ExplanationFact(
                    f"provenance.reviews[{index}].decision_note",
                    review.decision_note,
                    "provenance_review_note",
                    subject,
                )
            )
    for index, note in enumerate(record.ambiguity_notes):
        facts.append(
            ExplanationFact(
                f"ambiguity_notes[{index}]", note, "explicit_ambiguity", subject
            )
        )
    limitations = [
        ExplanationLimitation(
            "ATTACHMENT_NOT_PROOF",
            "Attached sources and evidence do not by themselves prove a claim.",
        ),
        ExplanationLimitation(
            "EVIDENCE_SUFFICIENCY_NOT_ASSESSED",
            "The explanation does not assess evidence sufficiency.",
        ),
    ]
    availability = ExplanationAvailability.AVAILABLE
    if not record.evidence:
        availability = ExplanationAvailability.PARTIAL
        limitations.append(
            ExplanationLimitation(
                "NO_EVIDENCE_ATTACHED",
                "No evidence references are attached to the record.",
                "record.evidence",
            )
        )
    return Explanation(
        ExplanationType.RECORD_EVIDENCE,
        availability,
        subject,
        tuple(facts),
        tuple(references),
        tuple(limitations),
        f"Explicit evidence and provenance for {record.identifier}.",
    )


def build_record_status_explanation(
    record: CandidateRecord,
    custody_entry: CandidateIdentifierRegistryEntry | None = None,
) -> Explanation:
    if not isinstance(record, CandidateRecord):
        raise UnsupportedExplanationTargetError(
            "record status explanation requires CandidateRecord"
        )
    if custody_entry is not None and custody_entry.identifier != record.identifier:
        raise InvalidExplanationInputError(
            f"custody identifier {custody_entry.identifier} does not match record {record.identifier}"
        )
    subject = _record_reference(record)
    facts = [
        ExplanationFact(
            "record.identifier", str(record.identifier), "subject", subject
        ),
        ExplanationFact(
            "record.record_kind", record.record_kind.value, "record_kind", subject
        ),
        ExplanationFact(
            "record.lifecycle", record.lifecycle.value, "governance_state", subject
        ),
    ]
    references = [subject]
    for index, note in enumerate(record.ambiguity_notes):
        facts.append(
            ExplanationFact(
                f"record.ambiguity_notes[{index}]", note, "explicit_ambiguity", subject
            )
        )
    supersession = record.provenance.supersession
    if supersession is not None:
        facts.extend(
            (
                ExplanationFact(
                    "record.provenance.supersession.predecessor_id",
                    str(supersession.predecessor_id),
                    "explicit_supersession",
                    subject,
                ),
                ExplanationFact(
                    "record.provenance.supersession.change_reason",
                    supersession.change_reason,
                    "explicit_supersession_reason",
                    subject,
                ),
            )
        )
    limitations = [
        ExplanationLimitation(
            "LIFECYCLE_NOT_SCIENTIFIC_TRUTH",
            "Record lifecycle is a governance state and does not establish scientific truth or publication readiness.",
        )
    ]
    if custody_entry is not None:
        custody_ref = ExplanationReference(
            ExplanationReferenceType.CUSTODY, str(custody_entry.identifier)
        )
        references.append(custody_ref)
        facts.append(
            ExplanationFact(
                "custody.state",
                custody_entry.state.value,
                "identifier_custody",
                custody_ref,
            )
        )
        limitations.append(
            ExplanationLimitation(
                "CUSTODY_NOT_LIFECYCLE_OR_PROMOTION",
                "Identifier custody is not record lifecycle, and registration does not promote a candidate.",
            )
        )
    return Explanation(
        ExplanationType.RECORD_STATUS,
        ExplanationAvailability.AVAILABLE,
        subject,
        tuple(facts),
        tuple(references),
        tuple(limitations),
        f"Explicit governance status for {record.identifier}.",
    )


_UNAVAILABLE_MESSAGES = {
    UnavailableRequestType.MISSING_INFORMATION: (
        "MISSING_EXPLANATION_INPUT",
        "The requested explanation cannot be produced from the supplied information.",
    ),
    UnavailableRequestType.SCIENTIFIC: (
        "SCIENTIFIC_EXPLANATION_UNAVAILABLE",
        "Scientific correctness cannot be inferred by this explanation service.",
    ),
    UnavailableRequestType.DIAGNOSIS: (
        "DIAGNOSIS_UNAVAILABLE",
        "Diagnosis is outside the explanation service scope.",
    ),
    UnavailableRequestType.RECOMMENDATION: (
        "RECOMMENDATION_UNAVAILABLE",
        "Recommendations are outside the explanation service scope.",
    ),
    UnavailableRequestType.CAUSAL: (
        "CAUSAL_EXPLANATION_UNAVAILABLE",
        "Causation cannot be inferred from the supplied Runtime objects.",
    ),
}


def build_unavailable_explanation(
    request_type: UnavailableRequestType, reason: str | None = None
) -> Explanation:
    if not isinstance(request_type, UnavailableRequestType):
        raise InvalidExplanationInputError(
            "unavailable request type must be UnavailableRequestType"
        )
    code, message = _UNAVAILABLE_MESSAGES[request_type]
    return Explanation(
        ExplanationType.UNAVAILABLE,
        ExplanationAvailability.UNAVAILABLE,
        limitations=(ExplanationLimitation(code, message, reason),),
        summary=f"Explanation unavailable: {request_type.value}.",
    )

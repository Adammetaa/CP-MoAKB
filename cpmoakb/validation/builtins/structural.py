"""Generic structural rules meaningful after domain construction."""

from __future__ import annotations

from dataclasses import dataclass

from cpmoakb.domain import (
    CandidateIdentifier,
    CandidateRecord,
    RecordKind,
    RelationshipRecord,
    ValidationIssue,
    ValidationSeverity,
)

from ..context import ValidationContext
from ..enums import RuleApplicability, ValidationLayer
from ..errors import UnsupportedValidationTargetError
from ..rules import RuleMetadata, ValidationTarget, issue


def _record(target: ValidationTarget) -> CandidateRecord:
    if not isinstance(target, CandidateRecord):
        raise UnsupportedValidationTargetError(
            "structural record rule requires one CandidateRecord"
        )
    return target


@dataclass(frozen=True, slots=True)
class PreferredLabelRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-STR-001",
        "Preferred label required",
        ValidationLayer.STRUCTURAL,
        "A generic candidate must expose at least one explicitly preferred label.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.RECORD,
        "Mark one reviewed or provisional label preferred for its language and locale.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        record = _record(target)
        if record.labels.preferred:
            return ()
        return (
            issue(
                self.metadata,
                record,
                "Candidate has no preferred label.",
                field_path="labels",
            ),
        )


@dataclass(frozen=True, slots=True)
class AmbiguityNoteContentRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-STR-002",
        "Ambiguity notes must contain text",
        ValidationLayer.STRUCTURAL,
        "Present ambiguity notes must be non-empty after conservative whitespace checks.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.RECORD,
        "Remove the empty item or provide an explicit ambiguity statement.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        record = _record(target)
        return tuple(
            issue(
                self.metadata,
                record,
                "Ambiguity note is empty or has surrounding whitespace.",
                field_path=f"ambiguity_notes[{index}]",
            )
            for index, note in enumerate(record.ambiguity_notes)
            if not note or note != note.strip()
        )


@dataclass(frozen=True, slots=True)
class EvidenceIdentifierUniquenessRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-STR-003",
        "Evidence identifiers must be unique",
        ValidationLayer.STRUCTURAL,
        "Evidence local keys must not collide within one candidate.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.RECORD,
        "Assign a distinct local evidence key without changing source identity.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        record = _record(target)
        seen: set[str] = set()
        duplicate_ids: set[str] = set()
        for evidence in record.evidence:
            if evidence.identifier in seen:
                duplicate_ids.add(evidence.identifier)
            seen.add(evidence.identifier)
        return tuple(
            issue(
                self.metadata,
                record,
                f"Evidence identifier {identifier!r} is duplicated.",
                field_path="evidence",
            )
            for identifier in sorted(duplicate_ids)
        )


@dataclass(frozen=True, slots=True)
class RelationshipEndpointIdentifierRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-STR-004",
        "Relationship endpoints require entity candidate identifiers",
        ValidationLayer.STRUCTURAL,
        "Current generic relationship endpoints must be entity-form candidate identifiers.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.RECORD,
        "Use explicit CPM-CAND-E identifiers; canonical and relationship endpoint forms are deferred.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        record = _record(target)
        if not isinstance(record, RelationshipRecord):
            return ()
        findings: list[ValidationIssue] = []
        for field, identifier in (
            ("subject_id", record.subject_id),
            ("object_id", record.object_id),
        ):
            if (
                not isinstance(identifier, CandidateIdentifier)
                or identifier.kind is not RecordKind.ENTITY
            ):
                findings.append(
                    issue(
                        self.metadata,
                        record,
                        f"Relationship {field} is not an entity candidate identifier.",
                        field_path=field,
                    )
                )
        return tuple(findings)


STRUCTURAL_RULES = (
    PreferredLabelRule(),
    AmbiguityNoteContentRule(),
    EvidenceIdentifierUniquenessRule(),
    RelationshipEndpointIdentifierRule(),
)

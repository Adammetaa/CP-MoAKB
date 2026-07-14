"""Bounded cross-object rules over an explicit in-memory batch context."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass

from cpmoakb.domain import (
    CandidateIdentifier,
    CandidateRecord,
    EntityRecord,
    RelationshipRecord,
    ValidationIssue,
    ValidationSeverity,
)

from ..context import ValidationContext
from ..enums import RuleApplicability, ValidationLayer
from ..errors import UnsupportedValidationTargetError
from ..rules import RuleMetadata, ValidationTarget, issue


def _batch(target: ValidationTarget) -> tuple[CandidateRecord, ...]:
    if not isinstance(target, tuple) or not all(
        isinstance(record, CandidateRecord) for record in target
    ):
        raise UnsupportedValidationTargetError(
            "cross-object rule requires a tuple of CandidateRecord objects"
        )
    return target


@dataclass(frozen=True, slots=True)
class DuplicateRecordIdentifierRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-XOBJ-001",
        "Batch candidate identifiers must be unique",
        ValidationLayer.CROSS_OBJECT,
        "One explicit validation batch must not contain duplicate candidate identifiers.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.BATCH,
        "Remove the duplicate record; identifiers are never reallocated automatically.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        records = _batch(target)
        counts = Counter(record.identifier for record in records)
        first_by_id = {record.identifier: record for record in reversed(records)}
        return tuple(
            issue(
                self.metadata,
                first_by_id[identifier],
                f"Candidate identifier {identifier} occurs {counts[identifier]} times in the batch.",
                field_path="identifier",
            )
            for identifier in sorted(
                (identifier for identifier, count in counts.items() if count > 1),
                key=str,
            )
        )


@dataclass(frozen=True, slots=True)
class RelationshipReferenceExistenceRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-XOBJ-002",
        "Relationship references must exist in the batch",
        ValidationLayer.CROSS_OBJECT,
        "Candidate relationship subject and object references must resolve in the explicit context.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.BATCH,
        "Supply the referenced entity in the batch or correct the relationship reference.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        findings: list[ValidationIssue] = []
        for record in _batch(target):
            if not isinstance(record, RelationshipRecord):
                continue
            for field, identifier in (
                ("subject_id", record.subject_id),
                ("object_id", record.object_id),
            ):
                if isinstance(identifier, CandidateIdentifier) and not context.contains(
                    identifier
                ):
                    findings.append(
                        issue(
                            self.metadata,
                            record,
                            f"Relationship {field} reference {identifier} is absent from the batch.",
                            field_path=field,
                        )
                    )
        return tuple(findings)


@dataclass(frozen=True, slots=True)
class RelationshipEndpointEntityRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-XOBJ-003",
        "Relationship endpoints must resolve to entity records",
        ValidationLayer.CROSS_OBJECT,
        "Resolved relationship endpoints must be generic entity records, not relationships.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.BATCH,
        "Reference an EntityRecord candidate under current runtime semantics.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        findings: list[ValidationIssue] = []
        for record in _batch(target):
            if not isinstance(record, RelationshipRecord):
                continue
            for field, identifier in (
                ("subject_id", record.subject_id),
                ("object_id", record.object_id),
            ):
                if not isinstance(identifier, CandidateIdentifier):
                    continue
                resolved = context.get(identifier)
                if resolved is not None and not isinstance(resolved, EntityRecord):
                    findings.append(
                        issue(
                            self.metadata,
                            record,
                            f"Relationship {field} resolves to a non-entity record.",
                            field_path=field,
                        )
                    )
        return tuple(findings)


@dataclass(frozen=True, slots=True)
class RelationshipSelfReferenceRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-XOBJ-004",
        "Relationship cannot reference itself",
        ValidationLayer.CROSS_OBJECT,
        "A relationship candidate must not use its own candidate identifier as an endpoint.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.BATCH,
        "Reference the intended entity candidate; self-referential relationship endpoints are deferred.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        findings: list[ValidationIssue] = []
        for record in _batch(target):
            if not isinstance(record, RelationshipRecord):
                continue
            for field, identifier in (
                ("subject_id", record.subject_id),
                ("object_id", record.object_id),
            ):
                if identifier == record.identifier:
                    findings.append(
                        issue(
                            self.metadata,
                            record,
                            f"Relationship uses its own identifier as {field}.",
                            field_path=field,
                        )
                    )
        return tuple(findings)


@dataclass(frozen=True, slots=True)
class SupersessionReferenceExistenceRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-XOBJ-005",
        "Supersession predecessor must exist in the batch",
        ValidationLayer.CROSS_OBJECT,
        "A predecessor named in supersession metadata must resolve when batch context is supplied.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.BATCH,
        "Supply the predecessor candidate or correct the supersession reference.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        return tuple(
            issue(
                self.metadata,
                record,
                f"Supersession predecessor {record.provenance.supersession.predecessor_id} is absent from the batch.",
                field_path="provenance.supersession.predecessor_id",
            )
            for record in _batch(target)
            if record.provenance.supersession is not None
            and not context.contains(record.provenance.supersession.predecessor_id)
        )


CROSS_OBJECT_RULES = (
    DuplicateRecordIdentifierRule(),
    RelationshipReferenceExistenceRule(),
    RelationshipEndpointEntityRule(),
    RelationshipSelfReferenceRule(),
    SupersessionReferenceExistenceRule(),
)

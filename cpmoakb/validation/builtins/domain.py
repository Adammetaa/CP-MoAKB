"""Mechanically testable generic governance invariants."""

from __future__ import annotations

from dataclasses import dataclass

from cpmoakb.domain import (
    CandidateRecord,
    EntityRecord,
    RecordLifecycle,
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
            "domain record rule requires one CandidateRecord"
        )
    return target


@dataclass(frozen=True, slots=True)
class ScientificNameLabelSeparationRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-DOM-001",
        "Scientific name must remain separate from labels",
        ValidationLayer.DOMAIN,
        "A scientific-name string must not be duplicated as an ordinary multilingual label.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.RECORD,
        "Keep nomenclature in ScientificName and use independently governed display labels.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        record = _record(target)
        if not isinstance(record, EntityRecord) or record.scientific_name is None:
            return ()
        if record.scientific_name.name not in {
            label.text for label in record.labels.labels
        }:
            return ()
        return (
            issue(
                self.metadata,
                record,
                "Scientific name is duplicated in the multilingual label collection.",
                field_path="scientific_name.name",
            ),
        )


@dataclass(frozen=True, slots=True)
class EvidenceSourceLinkageRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-DOM-002",
        "Evidence source linkage required",
        ValidationLayer.DOMAIN,
        "Every evidence source key must be declared by the record's source references.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.RECORD,
        "Add the corresponding source reference or correct the evidence source key.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        record = _record(target)
        known = set(record.source_ids) | {
            source.identifier for source in record.sources
        }
        return tuple(
            issue(
                self.metadata,
                record,
                f"Evidence {evidence.identifier!r} references undeclared source {evidence.source_id}.",
                field_path=f"evidence[{index}].source_id",
            )
            for index, evidence in enumerate(record.evidence)
            if evidence.source_id not in known
        )


@dataclass(frozen=True, slots=True)
class SupersessionSelfReferenceRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-DOM-003",
        "Supersession cannot reference the same candidate",
        ValidationLayer.DOMAIN,
        "A candidate must not identify itself as its predecessor.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.RECORD,
        "Reference the actual predecessor candidate or remove incorrect supersession metadata.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        record = _record(target)
        supersession = record.provenance.supersession
        if supersession is None or supersession.predecessor_id != record.identifier:
            return ()
        return (
            issue(
                self.metadata,
                record,
                "Candidate supersession metadata references the candidate itself.",
                field_path="provenance.supersession.predecessor_id",
            ),
        )


@dataclass(frozen=True, slots=True)
class InactiveLifecycleWarningRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-DOM-004",
        "Inactive lifecycle requires caution",
        ValidationLayer.DOMAIN,
        "Rejected or superseded candidates are unsafe to assume active.",
        ValidationSeverity.WARNING,
        "1.0",
        RuleApplicability.RECORD,
        "Check lifecycle before active use and follow the recorded successor or decision.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        record = _record(target)
        if record.lifecycle not in {
            RecordLifecycle.REJECTED,
            RecordLifecycle.SUPERSEDED,
        }:
            return ()
        return (
            issue(
                self.metadata,
                record,
                f"Candidate lifecycle is {record.lifecycle.value}; active use must not be assumed.",
                field_path="lifecycle",
            ),
        )


@dataclass(frozen=True, slots=True)
class ProvenanceEvidenceLinkageRule:
    metadata: RuleMetadata = RuleMetadata(
        "CPM-VAL-DOM-005",
        "Provenance evidence references must resolve locally",
        ValidationLayer.DOMAIN,
        "Evidence keys named by provenance must exist in the candidate evidence collection.",
        ValidationSeverity.ERROR,
        "1.0",
        RuleApplicability.RECORD,
        "Add the evidence object or correct the provenance evidence key.",
    )

    def validate(
        self, target: ValidationTarget, context: ValidationContext
    ) -> tuple[ValidationIssue, ...]:
        record = _record(target)
        known = {evidence.identifier for evidence in record.evidence}
        return tuple(
            issue(
                self.metadata,
                record,
                f"Provenance references missing evidence {identifier!r}.",
                field_path=f"provenance.evidence_ids[{index}]",
            )
            for index, identifier in enumerate(record.provenance.evidence_ids)
            if identifier not in known
        )


DOMAIN_RULES = (
    ScientificNameLabelSeparationRule(),
    EvidenceSourceLinkageRule(),
    SupersessionSelfReferenceRule(),
    InactiveLifecycleWarningRule(),
    ProvenanceEvidenceLinkageRule(),
)

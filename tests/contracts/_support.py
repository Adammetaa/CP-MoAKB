"""Shared synthetic scenario for Runtime 0.1 contract tests."""

from __future__ import annotations

from cpmoakb.adapters.yaml import load_candidate_yaml
from cpmoakb.domain import EntityRecord

SYNTHETIC_YAML = """schema_version: "1.0"
candidate_id: "CPM-CAND-E-994001"
record_kind: "entity"
domain_type: "SyntheticContractConcept"
lifecycle: "under_review"
labels:
  - language: "en"
    text: "Fictional Contract Widget"
    status: "provisional"
    preferred: true
  - language: "en"
    text: "Imaginary Contract Device"
    status: "provisional"
    preferred: false
scope_note: "Synthetic Runtime contract scenario only."
authorities:
  - identifier: "synthetic-contract-authority"
    name: "Fictional Contract Authority"
    scope_note: "Synthetic contract testing only."
sources:
  - identifier: "synthetic-contract-source"
    title: "Fictional Contract Reference"
    issuing_organization: "Synthetic Contract Group"
    source_type: "fictional-reference"
    canonical_locator: "urn:synthetic:contract-source"
    scope_note: "Synthetic contract testing only."
evidence:
  - identifier: "fictional-contract-evidence"
    source_id: "synthetic-contract-source"
    locator: "Synthetic section 1"
    note: "Fictional evidence note."
    role: "contextual"
    reviewer_status: "synthetic-reviewed"
provenance:
  creation:
    created_at: "2026-01-01"
    created_by: "synthetic-contract-role"
  source_ids:
    - "synthetic-contract-source"
  evidence_ids:
    - "fictional-contract-evidence"
scientific_name:
  name: "Fictitia contracta"
  verification_status: "synthetic_unverified"
  name_status: "fictional"
"""


def load_synthetic_record() -> EntityRecord:
    record = load_candidate_yaml(SYNTHETIC_YAML)
    assert isinstance(record, EntityRecord)
    return record

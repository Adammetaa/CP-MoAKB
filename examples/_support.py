"""Small private synthetic-record helper shared by repository examples."""

from __future__ import annotations

from cpmoakb.adapters.yaml import load_candidate_yaml
from cpmoakb.domain import EntityRecord

SYNTHETIC_YAML = """schema_version: "1.0"
candidate_id: "CPM-CAND-E-990001"
record_kind: "entity"
domain_type: "SyntheticConcept"
lifecycle: "candidate"
labels:
  - language: "en"
    text: "Fictional Widget"
    status: "provisional"
    preferred: true
  - language: "en"
    text: "Imaginary Device"
    status: "provisional"
    preferred: false
scope_note: "Synthetic executable-example record only."
provenance:
  creation:
    created_at: "2026-01-01"
    created_by: "synthetic-example-role"
"""


def synthetic_record() -> EntityRecord:
    """Return one fictional candidate through the public YAML adapter."""

    record = load_candidate_yaml(SYNTHETIC_YAML)
    if not isinstance(record, EntityRecord):
        raise TypeError("synthetic example must produce an EntityRecord")
    return record

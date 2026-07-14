# RAS-002: Validation Framework

**Status:** Active

**Version:** 1.0

This is the normative specification for deterministic Runtime validation. It builds on the [Runtime Domain Model](../domain-model.md), [extension boundaries](../extension-boundaries.md), and accepted ADRs.

## Validation layers

1. **Representation.** Input-format checks belong to adapters. The Runtime engine MUST NOT parse YAML or JSON. A future adapter MAY translate representation findings into Runtime issue conventions.
2. **Structural.** Rules cover required record-level shape that may remain mechanically invalid after construction, including identifier-kind compatibility, controlled-value content, and internal collection consistency.
3. **Domain.** Rules mechanically enforce accepted generic governance, including lifecycle caution, scientific-name separation, and source/evidence/provenance boundaries. They MUST NOT infer scientific truth.
4. **CrossObject.** Rules use an explicitly supplied collection or context for duplicate identifiers, reference existence, endpoint compatibility, and bounded source/evidence consistency.
5. **Scientific.** Scientific and domain-specific assessment is explicitly deferred. It MUST NOT be presented as implemented and requires qualified authority and reviewer governance. Mechanical validation MUST NOT substitute for scientific review.

## Rules and issues

Every rule MUST have a stable opaque identifier, human-readable name, layer, description, applicability, default severity, version, and optional remediation guidance. Rules MUST be deterministic and MUST NOT mutate input, perform I/O or network access, or consult implicit current time. Invalid data MUST produce issues; framework exceptions are reserved for programming or configuration defects.

Each issue MUST carry its rule ID as its code, severity, message, applicable field path and record identifier, and available remediation hint. Field paths SHOULD identify the narrowest stable domain field that explains the finding. Current rule identifiers use `CPM-VAL-STR-NNN`, `CPM-VAL-DOM-NNN`, or `CPM-VAL-XOBJ-NNN`.

## Profiles

A profile is an immutable, named, versioned, explicitly ordered collection of rules. Duplicate IDs MUST be rejected. Profiles MUST NOT discover rules dynamically or vary with environment, locale, network, filesystem, or time. Representation and Scientific rules MUST NOT be registered in Runtime profiles.

## Context

`ValidationContext` is a read-only index over explicitly supplied immutable candidate records. Construction MUST be deterministic and MUST reject duplicate record identifiers. It MUST NOT become a repository, service locator, dependency-injection container, filesystem lookup, or network lookup. Sources and authorities remain on records in this first bounded context.

## Results and execution

The framework MUST reuse Runtime Core `ValidationIssue`, `ValidationSeverity`, and `ValidationResult`. It MUST collect ordinary failures rather than stop at the first issue. Profile execution follows declared rule order and deterministic record order. The existing `ValidationResult` then provides the public issue order by severity value, record identifier, field path, rule ID, and message.

Results distinguish errors, warnings, and informational issues and retain rule/profile traceability through the explicit profile and issue codes. A valid result does not establish scientific correctness.

## Active built-in inventory

- Structural: preferred label, ambiguity-note content, evidence-key uniqueness, relationship endpoint identifier form.
- Domain: scientific-name/label separation, evidence/source linkage, self-supersession, inactive-lifecycle warning, provenance/evidence linkage.
- Cross-object: duplicate records, relationship reference existence, endpoint entity type, relationship self-reference, supersession reference existence.

No Scientific rule is implemented or registered.

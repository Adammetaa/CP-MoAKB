# Candidate-to-Production Gate

Candidate records are non-production review artifacts. They must be isolated under the future `data/candidates/rice/` path and carry Candidate status; Sprint-015A creates neither the path nor records. Production promotion is a separate controlled change, never a rename, merge, build side effect, or automatic CI action.

## Mandatory gate

Every condition must pass:

1. The pilot physical-format ADR is Accepted.
2. Every material source is Approved for Pilot Use for the exact claim and extraction method.
3. Evidence references and provenance are complete and resolvable.
4. Candidate identifier uniqueness, non-reuse, namespace/status, and references validate.
5. Thai and supported English labels pass language/terminology review.
6. Applicable domain, pathology, entomology, weed-science, zoology, taxonomy, evidence, and rights reviews pass.
7. Relationship types, direction, context, evidence, and non-inference boundaries pass architecture/domain review.
8. Conflicts and disputed values remain visible with decisions; no silent merge or overwrite occurred.
9. No unsupported recommendation, diagnostic certainty, causality, regulatory status, safety conclusion, or product authorization is present or inferred.
10. Deterministic parsing, structural validation, references, ordering, source status, and prohibited-artifact checks pass without mutating candidates.
11. Scope matches the approved tranche and completeness/gaps are declared.
12. Design Freeze, copyright/reuse, privacy, and generated-artifact audits pass.
13. The Chief Architect approves the candidate release report.
14. The Product Owner makes an explicit release decision.

Failure leaves the item Candidate, Restricted, disputed, rejected, or deferred as appropriate. Partial promotion requires a newly declared bounded release scope and must not make excluded candidates appear approved.

## Promotion evidence

The controlled promotion change must include input commit, source-register freeze, validator/version, review matrix with decisions, conflict and exception register, deterministic output/reproduction evidence, exact promoted identifiers/relationships, exclusions, release notes, Chief Architect approval reference, and Product Owner decision. Published status does not mean universal scientific truth.

# Evidence and Traceability Components

Status: Active blueprint
Version: 1.0

## Purpose
Let reviewers follow explicit provenance and contradiction without hidden inference.
## Scope
Source identity, locator, claim links, authority, rights, withdrawal, conflict, review, candidate, and decision links.
## Authority
Subordinate to KAS-003/004, Editorial evidence workflow, Review Framework, Templates, and [primary blueprint](../knowledge-workspace-blueprint.md).
## Information Shown
Source identity/version; evidence locator/context; claim supported; claim
contradicted; evidence role; source authority/scope; rights status; withdrawal;
conflicting evidence; review status; evidence-to-claim, claim-to-candidate, and candidate-to-decision links.
## Actions
Follow Candidate → Claim → Evidence → Source → Authority → Review → Decision;
reverse-navigate explicit links; compare evidence; open rights/withdrawal findings.
## Prohibited Actions
No generated link, truth score, inferred causation, authority ranking, hidden
contradiction, automatic summary, or inaccessible-source certainty.
## Workflow
Select candidate assertion → inspect scoped claim → verify evidence and locator →
inspect source/version/authority/rights → review findings/decision → return to candidate.
## Failure Modes
Broken reverse link, title-only source, locator hidden behind interaction, or conflict flattened into one conclusion.
## Empty States
No evidence, inaccessible evidence, none required, and not reviewed MUST remain distinct.
## Accessibility
Traceability chain has numbered text steps, link direction, status descriptions,
and no graph-only information.
## Governance Boundaries
Traceability exposes recorded evidence; it MUST NOT infer sufficiency, truth, diagnosis, recommendation, or permission.
## Audit Requirements
Changes to links, locators, source versions, roles, rights, withdrawal, and decisions remain versioned.
## Examples
A contradicted fictional claim displays supporting and adverse items side by side.
## Non-examples
“Authority score 95” MUST NOT appear.
## Future Implementation Considerations
No graph store, search index, projection, API, or automated extraction is selected.
## Change Control
Changes require evidence, citation, rights, ontology, accessibility, and review analysis.

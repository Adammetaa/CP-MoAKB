# Investigation Output and Visibility Model

Status: Active

Version: 1.0

## Visibility Principle

Visibility is a governed decision based on purpose, role, authority, privacy,
sensitivity, stage, review, and publication standing. It is not implied by
container membership or stage. “Visible” means eligible to be shown in a bounded
context, not public, correct, approved, or actionable.

## Audience Classes

- **SPA-visible:** necessary for responsible case coordination within authority.
- **Service Provider-visible:** bounded operational context appropriate to the
  service relationship, excluding restricted analysis and sensitive material.
- **Agronomist-visible:** investigation material needed for qualified review.
- **Reviewer-only:** provisional, adverse, sensitive, conflicted, or deliberative
  content limited to assigned reviewers.
- **Internal governance-only:** authority, conflict, publication, retention, or
  boundary material restricted to governance purpose.
- **Publication eligible:** separately approved as eligible under Publication Boundary.
- **Not publication eligible:** case-bound, unreviewed, provisional, sensitive,
  rejected, withdrawn, or otherwise ineligible content.

## Output Matrix

| Output | Early intake / collection | Investigation / differential | Reviewed and later stages | Visibility boundary |
|---|---|---|---|---|
| case summary | attributable intake summary with uncertainty | updated bounded summary | reviewed or closure summary | SPA; limited Service Provider; reviewers as needed |
| recorded observations | distinguish reported and direct | show provenance and limits | retain reviewed status and history | SPA/Agronomist; Service Provider only as appropriate |
| missing information | explicit from intake onward | visible with gaps and attempts | retained if unresolved | SPA and reviewers; bounded external disclosure |
| unanswered questions | visible after human question authoring | include skipped/unavailable reasons | retain relevant open items | SPA; reviewer visibility; not publication eligible by default |
| evidence inventory | material presence and quality pending | relevance roles and limitations | retained with review standing | SPA/Agronomist; sensitive items restricted |
| evidence limitations | visible with every use | prominent in comparison | included in reviewed finding basis | all authorized recipients of the related evidence |
| provisional candidates | hidden before explicit authorship | prominently provisional | remain provisional unless separately governed downstream | SPA/Agronomist or reviewer-only; never public by default |
| differential comparison | not shown before adequate basis | reviewer-facing, no rank | bounded reviewed comparison may be SPA-visible | reviewer-first; Service Provider only with authorized explanation |
| reviewer comments | assignment-dependent | visible to relevant reviewers | disclose or restrict by purpose and sensitivity | reviewer-only unless explicitly approved for broader use |
| reviewed findings | unavailable before mandatory review | draft marked review-pending | visible with scope, limits, reviewer, and unresolved issues | SPA; bounded Service Provider; publication eligibility separate |
| unresolved issues | visible whenever material | prominent during comparison | disclosed with findings, options, closure, or follow-up | all recipients whose interpretation depends on them |
| Management Options | unavailable in early stages | unavailable until eligibility | only separately governed eligible options | authorized users; option is not Recommendation |
| decision record | unavailable until attributable choice | not inferred from investigation | visible to relevant case participants | sensitive; not publication eligible by default |
| action record | unavailable until attributable action | not inferred from decision | visible with source and limits | bounded participants and reviewers |
| follow-up requirement | may arise at any stage | visible with owner and purpose | retained until resolved or closed with reason | relevant participant and reviewer visibility |
| outcome record | unavailable before follow-up capture | never predicted | visible with provenance and no causal inference | bounded case roles; publication eligibility separate |

## Provisional and Hidden Content

Unreviewed candidates, draft comparisons, reviewer deliberation, sensitive
reports, safety or regulatory concerns, conflicts, rejected interpretations, and
internal governance material must be visibly marked or restricted. Hidden from
one audience does not mean deleted. Provisional markings persist in summaries,
exports, translations, and later views until an authorized change.

## Publication Boundary

Case visibility and publication eligibility are separate. Publication eligible
does not mean published. This blueprint does not change the repository's
`not_published` status or create release artifacts.

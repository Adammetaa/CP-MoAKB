# Need-for-action and management decision gate

Status: accepted first Layer-④ decision projection; not published

## Decision boundary

`need-for-action-decision/v1` asks whether evidence supports monitoring,
additional investigation, management review, or Human Review. Identification,
current activity, progression, observable burden, Need-for-Action, management
selection, chemical eligibility, efficacy, and product selection remain separate.

The projection never emits spray-required, chemical-required, dose, product,
active-ingredient, MoA-ranking, or execution decisions.

## Inputs and states

Inputs are Case evidence: identification and alternatives, activity, historical
damage, progression, direct burden measurements, crop/stage context, governed
Action Evidence, failed-control context, regulation, and explicit gaps. Burden is
not converted into generic low/medium/high severity.

Outputs include `MORE_EVIDENCE_REQUIRED`, `CONTINUE_MONITORING`,
`NO_ACTION_DETERMINATION_SUPPORTED`, `MANAGEMENT_REVIEW_JUSTIFIED`, and
`HUMAN_REVIEW_REQUIRED`. Chemical review is separately blocked or unresolved.

Historical damage without current activity, progression, or new damage cannot
open management review. Current activity and progression require an applicable
governed Action Evidence record before they can justify management review.

## Action Evidence

Action Evidence types remain explicit rather than a generic threshold. Every
record preserves subject, criterion type, measurement, unit, sampling method,
crop/stage applicability, geography, Source, locator, and limitations.

The first operational vertical slice reuses `AE-076-BPH-001/v1`,
`CL-076-BPH-ET-001/v1`, and `EV-076-BPH-ET-001/v1`: the Thai field activity states
an Economic Threshold of 10 brown planthoppers per rice plant. The known source
wording mismatch between average insects per point and the stated insects-per-
plant criterion remains visible and requires review; no conversion is allowed.

- Missing insects/plant -> more evidence.
- An explicit insects-per-plant value below 10 -> continue monitoring.
- An explicit insects-per-plant value at or above 10 -> management review,
  subject to the record's limitations; never “spray required.”

Leaffolder evidence remains international reference-only and cannot become a Thai
operational trigger. Blast, brown spot, rice broadleaf, and sedge cases retain
explicit action-authority gaps. Weather and nearby cases cannot create action.
Abiotic plausibility cannot produce fertilizer, water, or corrective-product
instructions. Failed control must retain Sprint-081 gaps before review.

## Management and two-key gate

Supported option classes include monitoring, field inspection, governed cultural,
mechanical, water, biological, chemical-review, expert-review, and other governed
management. A class is exposed only with an eligibility state; generic context is
not a Case recommendation.

Chemical options can enter decision review only when both keys pass:

1. Need-for-Action justifies management review.
2. A defensible current Crop x Target x Use x Registration relationship is
   regulatorily eligible.

Current Sprint-077R chains do not satisfy Key B, so chemical review remains
unresolved or blocked. Even future two-key success means eligibility for review,
not recommendation. Regulatory eligibility, efficacy, Case suitability, and
product ranking remain distinct.

## Explainability and downstream boundary

The Case decision record preserves timestamp, subject, identification, activity,
progression, burden, Action Evidence, applicability, limitations, decision state,
management and chemical gates, Human Review reasons, provenance chains, and one
next-best question. Scientific and regulatory provenance are separate.

No management plan, product/application plan, or drone mission is created. A
decision or field outcome is never promoted to Canonical Knowledge.

## Knowledge gaps

- Thai operational Action Evidence for leaffolder, blast, brown spot, broadleaf,
  sedge, and abiotic subjects
- resolution of the BPH point-versus-plant sampling wording
- complete current Thai Crop x Target x Use x Registration relationships
- governed efficacy and Case-suitability comparisons
- subject-specific non-chemical option applicability
- resistance-management decision authority

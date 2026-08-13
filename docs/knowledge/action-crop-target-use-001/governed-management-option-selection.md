# Governed Management Option Selection

## Purpose and boundary

A Management Option is a bounded, Case-derived candidate for human decision review. It explains why an option class is eligible, information-required, Human Review required, authority-blocked, evidence-blocked, or not currently justified. It is not a diagnosis, prescription, selected treatment, product choice, rate, application instruction, execution task, or efficacy claim.

Eligibility starts with the existing reviewed finding, Need-for-Action decision, and Management Suitability evaluation. Knowledge-base existence alone never makes an option eligible. Each candidate preserves the Case reference, decision source, target problem, evidence and authority bases, limitations, unresolved gaps, Human Review status, provenance, evaluation context, and backward trace to Case observations and decisions.

The governed class order is `CONTINUE_MONITORING`, `CULTURAL_MANAGEMENT`, `MECHANICAL_MANAGEMENT`, `BIOLOGICAL_MANAGEMENT`, `CHEMICAL_REVIEW`, `EXPERT_REVIEW`, and `NO_ACTION_CURRENTLY_JUSTIFIED`. This is deterministic presentation order, not ranking. Multiple classes may be eligible, non-chemical options remain first-class, and commercial preference never participates.

## Authority and Chemical Review

`CHEMICAL_REVIEW` only opens a governed human decision-review path. It does not prescribe or execute an application. Management review justified is not chemical treatment justified.

The existing Thai regulatory Key B remains authoritative. An active-ingredient or product-name match, registration identity, or IRAC/FRAC/HRAC classification does not establish an exact crop-target-use chain and does not authorize product, formulation, rate, timing, mixture, method, drone use, re-treatment, or MoA switching. Incomplete authority leaves Chemical Review authority-blocked or routed to explicit Human Review; Human Review cannot waive missing authority. MoA data may explain differences but cannot create a recommendation or imply resistance.

## Human Review, Field Action, and traceability

Human Review remains explicit for unresolved identity, conflicting evidence, failed-control cases, ambiguous suitability, regulatory interpretation, or material tradeoffs. Approval is never inferred. Failed control preserves application context, timing, identification, coverage, environmental, susceptibility, and other alternatives without inferring resistance, dose increase, repeat treatment, tank mixing, stronger chemistry, or an MoA switch.

When an option state depends on a missing observable fact, selection points back to `field-action-handoff/v1`. It creates neither a second task system nor an application task. The existing architecture continues to produce at most one highest-value evidence action, requires explicit human completion, records a new Observation, and reruns the Case gates.

The trace is Case -> reported information -> Observation -> Evidence -> Hypothesis -> differential comparison -> Human Review -> reviewed finding -> Need-for-Action -> Management Suitability -> Management Option candidate -> authority/evidence state -> next governed step.

## Learn, privacy, and UI boundaries

Evaluation stays browser-local and performs no transmission, analytics, tracking, persistent GPS, or automatic expert handoff. It does not change the frozen chat, SP Assistant, navigation, or localization surfaces.

Case outcomes remain Case evidence. They do not automatically alter thresholds, recommendations, canonical knowledge, efficacy or product claims, resistance state, or global confidence. Any future canonical promotion remains separately governed.

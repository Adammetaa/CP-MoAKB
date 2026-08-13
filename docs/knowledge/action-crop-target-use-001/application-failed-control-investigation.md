# Application quality and failed-control investigation

Status: accepted bounded investigation foundation; not published

## Purpose

`application-failed-control-investigation/v1` begins with
`REPORTED_CONTROL_FAILURE`, determines what outcome was actually observed, and
retains alternative explanations. It is a Case projection, not a control-failure,
application-quality, efficacy, or resistance determination.

Permanent boundaries include `CONTROL FAILURE ≠ RESISTANCE`, `DAMAGE PRESENT ≠
CURRENT ACTIVITY`, `OLD DAMAGE ≠ CONTROL FAILURE`, `CURRENT ACTIVITY ≠ CHEMICAL
ACTION REQUIRED`, `APPLICATION ISSUE PLAUSIBLE ≠ APPLICATION FAILURE CONFIRMED`,
and `FIELD OUTCOME ≠ CANONICAL EFFICACY CLAIM`.

## Case evidence

Outcome observation captures the expected and observed result, observation time,
affected and treated areas, untreated comparison, target presence, current
activity, new versus old damage, progression, and crop injury. User expectation
is context and is not a governed efficacy standard.

Intervention history preserves the user's original wording and separately records
date/time, product, active ingredient, formulation, exact user-reported rate and
unit, water volume, treated area, method, application count and interval, ordered
tank mixture, adjuvant, fertilizer, operator, equipment, and notes. Incompatible
units are not converted. Tank-volume arithmetic is labelled calculation and has
no scientific interpretation.

Drone observations may include model, nozzle/atomizer, flight height and speed,
route spacing, flow, droplet setting, tank and area, operation mode, overlap,
missed strips, interruption, and operator-reported abnormal events. These do not
establish application quality or biological deposition.

Weather at application and weather at observation are separate. Coordinates are
never transmitted automatically, and no arbitrary spray threshold is encoded.
Rice field-water condition remains contextual and product-specific instructions
cannot be generalized.

## MoA and regulatory governance

Exact resolved active ingredients may be classified using the governed IRAC
v11.5, FRAC 2026, and HRAC 2026 Evidence records in
`crop-protection-management-001/authority-completion.md`. Classification means
only MoA history. Repeated MoA does not establish resistance and does not produce
a rotation recommendation.

Regulatory review reuses Sprint-076/077/077R states. Product identity, active
identity, MoA, registration, efficacy, and resistance remain separate. Market
availability, prior use, and manufacturer material are not proof of a current
Crop x Target x Use x Registration chain.

## Differential and resistance gate

The differential retains target/identity, old versus current activity, timing,
application/deposition, environment and water, mixture/product, regulatory use,
reinfestation, and resistance hypotheses without ranking. Resistance cannot
become reviewable until target, current activity, intervention, rate, method,
environment, MoA history, regulatory context, reinfestation, and alternatives
have all been reviewed. The projection can never emit `RESISTANT` or
`RESISTANCE_CONFIRMED`.

The next-best-evidence selector asks only the first deterministic unresolved
question. Photo Missions are human-confirmed and can document current activity,
new versus old damage, treated comparisons, patterns, injury, plant bases, and
folded-leaf interiors. No image interpretation is performed.

## Management, execution, and learning boundaries

The projection prepares evidence for Layer ④ but never decides to reapply, stop,
switch, increase a dose, strengthen chemistry, mix another product, or rotate
MoA. Economic facts may be retained without loss calculation or spending advice.
Case observations can later support an Application Plan and execution record.
Intervention -> T1 -> T2 -> outcome is preserved without promoting a field
outcome to canonical efficacy knowledge.

## Knowledge gaps

- target-, stage-, product-, and use-specific application-quality relationships
- measured deposition and coverage criteria
- product-specific compatibility, rainfastness, water-management, and crop-safety evidence
- complete current Thai Crop x Target x Use x Registration joins
- case-specific reinfestation source and movement direction
- governed architecture for resistance confirmation

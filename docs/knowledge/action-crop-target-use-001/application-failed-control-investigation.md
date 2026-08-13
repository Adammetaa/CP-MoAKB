# Application quality and failed-control investigation

Status: accepted bounded investigation foundation; not published

## Sprint-092K target-specific deposition evidence

### Deposition evidence

`target-specific-deposition-evidence/v1` records deposits relative to one Case and Application Event. A measurement retains method, collector identity, location and orientation, value, exact unit and denominator, timestamp, collector count, sampling context, source, measured/observed state, limitations, correction/supersession, provenance, and any explicitly governed derived formula. Deposition metrics such as droplet count, deposits per area, tracer mass, or instrument measurements are never silently converted into coverage.

### Coverage evidence

Coverage records collector-surface percentage, observed wetting/distribution, presence/absence, or spatial uniformity. `COVERAGE â‰  DEPOSITION`: neither concept is normalized into a common scale. A water-sensitive-paper image may be retained, but `Photo received â‰  automated droplet analysis â‰  measurement confirmed`; Sprint-092K performs no automatic counting or image interpretation.

### Target-specific measurement

Collector location determines what the record can support. Brown Planthopper context uses plant base/lower canopy; Rice Leaffolder uses folded-leaf interior; stem-borer groups use stem interior; Rice Blast depends on the affected organ and disease context. Upper-canopy measurement cannot establish plant-base exposure, folded-leaf exterior measurement cannot establish interior exposure, and external stem deposition cannot confirm internal exposure.

The BPH golden slice binds one user-submitted upper-canopy water-sensitive-paper coverage measurement to `APP-EVENT-091-BPH-001` and separately records plant-base deposition as `NOT_MEASURED`. The bounded interpretation is `POTENTIAL_COVERAGE_GAP`: upper-canopy coverage was measured while plant-base deposition remains unknown. This does not establish poor application, product failure, resistance, or causality.

### Sampling and threshold boundaries

Actual placement, orientation, number of collectors, field zone, missing/moved/contaminated collectors, timing, image quality, and manual-counting uncertainty remain visible. The system does not invent a collector count or sampling protocol and does not claim representativeness. No universal minimum droplets/cmÂ², coverage percentage, deposits/cmÂ², or quality/pass threshold exists unless a future governed source supports the exact crop, target, method, and context.

### Application context, failed control, and Field Action

Sprint-091P supplies Application Event, equipment, weather, canopy, timing, and target-location context; those settings remain separate from measured target exposure. A failed-control investigation can now ask whether the biological target location was sampled while retaining all other explanations. `field-action-handoff/v1` may request exactly one missing target-location measurement and requires explicit human or device submission; application completion, photo receipt, elapsed time, or Field Action creation does not create a measurement or a re-spray task.

### Outcome and recommendation boundaries

The prepared chain is `T0 -> Application Event -> Deposition/Coverage Evidence -> T1 -> T2 -> Outcome Review`. Measurements remain Case evidence: high deposition does not prove efficacy, and low or unknown deposition does not prove the cause of failed control. Case deposition evidence cannot reorder Product Comparison, waive `AUTHORITY_BLOCKED`, turn manufacturer guidance into a threshold, or promote local efficacy/resistance knowledge. CP-MoAKB still cannot prescribe water volume, drone height, nozzle, dose, timing, setting optimization, or re-treatment.

## Sprint-091P Application Context model

`application-context-evidence/v1` composes a Case-scoped Application Event, normalized context Assertions, potential limitations, missing evidence, Human Review, and later outcome observations. It captures what was actually observed or reported because method, water volume, equipment, weather, crop structure, target position, timing, and coverage may be relevant to explaining treatment performance. Every Assertion retains value, unit, denominator, timestamp, source, observed/reported state, direct/inferred state, limitations, and an optional superseded-Assertion reference. Unknown values remain `UNKNOWN` and no incompatible-unit conversion or default is introduced.

## Application Event boundary

An Application Event references a Case, timestamp, recorded product or ingredient when known, context, provenance, and limitations. It is prior Case history between T0 and T1/T2; it is not an execution task, spray order, schedule, prescription, or workflow-management object. `field-action-handoff/v1` remains the sole architecture for requesting one missing fact and requires explicit human submission before completion.

## Recorded context versus quality

The neutral states are `CONTEXT_RECORDED`, `CONTEXT_INCOMPLETE`, `POTENTIAL_LIMITATION`, `CONFLICTING_CONTEXT`, `NEEDS_REVIEW`, and `NOT_APPLICABLE`. Recorded context never becomes a spray-quality, suitability, risk, or pass/fail score. A reported 3 m flight height, 3 L/rai water volume, wind value, or line interruption can remain relevant to Human Review without being classified as good, bad, too high, too low, sufficient, or causal.

## Drone context

The model may retain equipment type/model, nozzle or atomizer, flight height and speed, flow, swath, droplet class, pressure, sensor mismatch, interruption, or operator events exactly as recorded. These are observations, not prescribed settings. They do not confirm biological deposition and never produce a height, speed, nozzle, flow, water-volume, or re-treatment instruction.

## Weather context

Application-time weather and later observation weather remain separate Assertions. Source class, timestamp, spatial/temporal relevance, instrument uncertainty, and missing values remain visible. A human field observation, device reading, local instrument, or regional source is not silently represented as exact field weather; no universal operational rule or causality is inferred.

## Target location and crop structure

Bounded target-location context supports Brown Planthopper at the plant base, Rice Leaffolder within folded leaves, stem-borer groups within stems, and Rice Blast on leaves or affected organs. Crop stage, canopy, lodging, leaf orientation, water level, and target position can inform investigation, but external application does not establish target exposure. Historical folded leaves do not establish current larvae; deadheart/whitehead does not identify a species; lesions do not confirm a pathogen.

## Coverage evidence

Coverage evidence remains distinct from settings. Direct wetting/deposition observations, untreated strips, skipped lines, overlap, interruption, blockage, flow anomalies, sensor mismatch, or operator-reported problems may be recorded. When it was not measured, the state is `UNKNOWN`; method, height, and water volume cannot fill the gap.

## Failed-control interaction

Failed-control investigation retains multiple open explanations: target identity/activity, timing, application context, weather, crop structure, coverage, target exposure, interruption, product identity, regulation, reinfestation, biological tolerance, and unresolved cause. A potential application limitation does not establish failure, resistance, wrong MoA, low dose, weak product, repeat treatment, stronger chemistry, or tank mixing.

## Product comparison and regulatory interaction

Application history may appear alongside product information, but it never changes Sprint-090P neutral ordering, score, eligibility, or selection. Application context cannot waive `AUTHORITY_BLOCKED`, and even complete regulatory authority would not prove application quality. Manufacturer guidance remains an attributed Manufacturer Source Fact and does not become a Case instruction.

## T0/T1/T2, Learn, privacy, and recommendation boundaries

The sequence `T0 -> Application Event -> T1 -> T2 -> Outcome Review` preserves explicit observations without establishing causality. Improvement does not prove efficacy and non-improvement does not prove resistance. There is no automatic efficacy, resistance, weather-rule, drone-setting, best-practice, ranking, or recommendation learning. Records remain browser-local with no telemetry upload, automatic GPS persistence, analytics, tracking, cloud synchronization, or background persistence. CP-MoAKB still cannot prescribe dose, drone settings, water volume, spray timing, re-treatment, mixtures, or products.

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

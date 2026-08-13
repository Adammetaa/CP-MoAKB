# Rice Damage Progression and Life-stage Investigation

Status: Accepted for bounded internal use; `not_published`

## Architecture and temporal model

Sprint-079K reuses Observation, Candidate, Evidence, Claim, Relationship, Case,
Next Best Action, Photo Mission, Knowledge View, and Unresolved Issue. The bounded
Case projection `rice-damage-progression/v1` compares attributable observations
without creating a new ontology.

Each T1/T2 record preserves sequence, observation time, source, scale, observed
tissue, distribution, activity cues, and explicit comparison statements. The
projection never derives biological onset or damage age from elapsed time.
First-noticed time remains distinct from actual onset.

Governed non-score states are `CURRENT_ACTIVITY_SUPPORTED`,
`CURRENT_ACTIVITY_NOT_ESTABLISHED`, `HISTORICAL_DAMAGE_SUPPORTED`,
`PROGRESSION_SUPPORTED`, `PROGRESSION_NOT_ESTABLISHED`, and
`MORE_EVIDENCE_REQUIRED`.

## Priority life-stage and activity relationships

| Candidate | Governed stage/activity relationship | Inspection location | Traceability | Limitation |
| --- | --- | --- | --- | --- |
| rice leaffolder | larva folds leaf and removes green tissue; larva/feeding scar/webbing may support current activity | inside newly affected folded leaf | `CL-RIC-006-I/B/O/v1`; `EV-RIC-006/v1`; RD pp.16-19 / PDF pp.27-30 | folded or white-damaged leaf alone does not establish current larval presence |
| brown planthopper | nymph/adult basal sap feeding; observed hopper/nymph/adult may support current activity | plant base above water | `CL-RIC-002-I/B/O/v1`; `EV-RIC-002/v1`; RD pp.4-7 / PDF pp.15-18 | yellow/dry patch alone does not identify the insect or current activity |
| grouped rice stem borers | source groups four species; larval boring relates to deadheart before heading and whitehead after heading | affected tiller/stem interior | `CL-RIC-007-I/B/O/v1`; `EV-RIC-007/v1`; RD pp.20-23 / PDF pp.31-34 | symptom alone does not establish stem borer or a species; explicit stage and interior evidence required |
| blast | lesion morphology only; reported new lesions, expansion, organs, or distribution may establish symptom progression | lesion/newly affected organ | `CL-RDC-001-O/v1`; `EV-RDC-001A/B/v1` | progression does not confirm pathogen or infection date |
| brown spot | lesion morphology only; same temporal comparison boundary as blast | lesion/newly affected organ | `CL-RDC-003-O/v1`; `EV-RDC-003A/B/v1` | progression does not confirm pathogen or incubation period |

No life-stage duration, generation time, infection date, incubation period, or
arbitrary day cutoff is represented.

## Deterministic comparison and follow-up

Explicit new affected tissue, wider distribution, patch expansion, additional
organs, or lesion expansion can produce `PROGRESSION_SUPPORTED`. Explicit old
damage only, or the same tissue with no observed activity, can produce
`HISTORICAL_DAMAGE_SUPPORTED`. New healthy growth is recorded separately and
does not prove recovery of the earlier causal process.

Next Best Evidence asks for one bounded reinspection: unfold newly affected
leaves, inspect plant bases again, inspect the affected tiller interior, or
record new lesions/expansion. Repeat Photo Mission may capture T1/T2 Field,
Plant, and Organ/Damage images while preserving observation time and source.
There is no automatic image comparison, similarity inference, or image analysis.
`Photo received ≠ Photo analyzed`.

## Need-for-action and context boundaries

Only BPH current-activity evidence can advance to
`ACTION_EVIDENCE_MEASUREMENT_REQUIRED`, because existing governed Thai Action
Evidence still requires its separate measurement and limitations. All other
priority candidates remain `ACTION_EVIDENCE_NOT_READY`. Current activity never
automatically produces chemical management; old damage never triggers management.

Weather and Nearby Field Watch remain `CONTEXTUAL`:
`NEARBY CASE ≠ TRANSMISSION`. Previous treatment preserves timing, application,
environment, identity, new-damage, and current-activity questions while
`CONTROL FAILURE ≠ RESISTANCE`. Regulatory and chemical gates remain closed.

## Knowledge gaps

Unresolved issues remain for quantitative progression, most pest activity
indicators, causal disease progression, species-level deadheart/whitehead
differentials, life-stage timing, temporal causality, stage-specific damage
beyond the cited slice, and validated recovery indicators.

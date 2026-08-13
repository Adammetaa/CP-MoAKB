# Rice Damage and Symptom Investigation Foundation

Status: Accepted for bounded internal use; `not_published`

## Architecture review

The existing Observation, Candidate, Evidence, Claim, Relationship, Case, Next
Best Action, and Knowledge View structures are sufficient. Sprint-078K adds a
bounded Case projection, `rice-damage-investigation/v1`; it does not create a new
ontology or object family.

The projection begins with an unknown-cause field observation and retains plant
part, observable feature, distribution, crop stage, environment, management
history, differential candidates, evidence roles, distinguishing gaps, next
evidence, and the Identification Gate. Observation remains distinct from
Evidence and Diagnosis.

## Observation vocabulary

| Dimension | Governed neutral values |
| --- | --- |
| Plant part | whole plant, tiller, leaf, leaf sheath, stem, node, panicle, neck, root |
| Observable feature | color, lesion, feeding scar, folding, rolling, cutting, chewing, drying, wilting, deformation, stunting |
| Distribution | single plant, scattered, patch, field-wide, edge-associated, water-related, unresolved |
| Photo scale | Field, Plant, Organ, Damage, visible pest/causal object |

No value is a diagnosis and no quantitative threshold is introduced.

## Knowledge population

| Observation family | Support | Governed candidate families | Smallest next evidence | Traceability / gap |
| --- | --- | --- | --- | --- |
| leaf lesion / spot / blight-like | `SUPPORTED` | brown spot; blast | inspect lesion shape and center | `CL-RDC-001-O/v1`, `CL-RDC-003-O/v1` |
| yellow / pale / orange discoloration | `PARTIALLY_SUPPORTED` | brown planthopper remains one unresolved comparison | inspect plant base; compare affected and healthy plants | `CL-RIC-002-O/v1`; nutrient, water, disease, and chemical-injury relations unresolved |
| folded / rolled leaf | `SUPPORTED` | rice leaffolder | unfold leaf; inspect feeding surface | `CL-RIC-006-O/v1` |
| chewed / scraped / skeletonized leaf | `PARTIALLY_SUPPORTED` | rice leaffolder remains one comparison | inspect both surfaces and folded tissue | `CL-RIC-006-O/v1`; broader chewing differential unresolved |
| deadheart-like | `UNSUPPORTED` | none asserted | inspect tiller base and inside stem | explicit knowledge gap |
| whitehead-like | `UNSUPPORTED` | none asserted | inspect panicle neck and stem interior | explicit knowledge gap |
| wilting / drying patches | `PARTIALLY_SUPPORTED` | brown planthopper remains one comparison | inspect plant base above water | `CL-RIC-002-O/v1`; water/root and other stresses unresolved |
| stunting / abnormal tillering | `UNSUPPORTED` | none asserted | compare roots, tillers, affected and healthy whole plants | explicit knowledge gap |
| weed presence | `SUPPORTED` | sedge group; rice-field broadleaf group | inspect stem, nodes, leaves, inflorescence | `RL-RWC-019/v1`, `CL-RWC-004-O/v1` |
| abnormality after chemical application | `UNSUPPORTED` | none asserted | preserve product, timing, rate, method, water, distribution | explicit application/chemical-injury knowledge gap |

Candidate order is deterministic source/workflow order, not probability,
confidence, ranking, or diagnosis. A visible insect is not required to begin an
insect investigation: damage-first records may open a candidate comparison while
the Identification Gate remains closed.

## Evidence, context, and next action

The existing roles `SUPPORTING`, `REQUIRED_TO_DISTINGUISH`, `CONTRADICTING`,
`CONTEXTUAL`, `UNAVAILABLE`, and `UNRESOLVED` are reused. Every supported
candidate cue retains Claim, Evidence, and exact locator provenance through the
existing profile.

Crop stage, weather, water, and management history are contextual only.
Chronological age alone does not establish developmental stage. Environment
cannot independently establish pest identity, infection, diagnosis, treatment
need, or recommendation. Previous control and observed response remain recorded,
but `CONTROL FAILURE ≠ RESISTANCE`.

Next Best Evidence is one deterministic direct-observation or Photo Mission
request at Field, Plant, Organ, or Damage scale. An image of a visible causal
object is optional. `Photo received ≠ Photo analyzed`; image presence creates no
scientific evidence until a human confirms a bounded Observation and the normal
evidence review occurs.

## Boundaries and unresolved issues

The projection always returns `CHEMICAL_REVIEW_BLOCKED` and no recommendation.
Sprint-076/077 regulatory gates remain authoritative. It does not rank causes,
ingredients, products, or MoA; recommend a dose; escalate a dose; infer
resistance; or automatically open chemical eligibility.

Priority gaps are governed rice evidence for deadheart/whitehead differentials,
nutrient and water/root stress, chemical injury and application problems,
stunting/abnormal tillering, and broader chewing/skeletonization causes.

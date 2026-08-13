# Rice abiotic differential investigation

Status: accepted bounded investigation foundation; not published

## Scope and boundary

This Case projection widens rice abnormality investigation without selecting a
cause. It preserves biotic and abiotic candidates together and produces no
fertilizer, pesticide, product, active-ingredient, rate, dose, or corrective
program recommendation.

Permanent boundaries are `SYMPTOM ≠ CAUSE`, `YELLOWING ≠ NUTRIENT
DEFICIENCY`, `LEAF BURN ≠ DISEASE`, `APPLICATION BEFORE SYMPTOM ≠
APPLICATION CAUSED SYMPTOM`, `WEATHER ASSOCIATION ≠ CAUSATION`, `SPATIAL
PATTERN ≠ CAUSE`, and `CONTROL FAILURE ≠ RESISTANCE`.

## Governed nutrient relationships

| Record | Accepted observation relationship | Required distinction | Authority |
| --- | --- | --- | --- |
| `EV-RAD-001/v1` / `CL-RAD-001-O/v1` | Nitrogen-deficient rice may be stunted; older leaves or whole plants may be yellowish green, with reduced tillering. | Leaf age/order, plant-wide expression, tillering, and laboratory soil/plant testing. Yellowing alone is insufficient; sulfur and iron disorders are source-identified look-alikes. | IRRI Rice Knowledge Bank, [Nitrogen deficiency](https://www.knowledgebank.irri.org/training/fact-sheets/nutrient-management/deficiencies-and-toxicities-fact-sheet/item/nitrogen-deficiency), “How to identify”; accessed 2026-08-13. |
| `EV-RAD-002/v1` / `CL-RAD-002-O/v1` | Potassium-deficient rice may be stunted with yellow-brown leaf margins or necrotic tips/margins on older leaves. | Leaf age/order, tip/margin location, field pattern, roots, and tungro evidence. Tip/margin injury alone is insufficient; tungro is a source-identified look-alike. | IRRI Rice Knowledge Bank, [Potassium (K)](https://www.knowledgebank.irri.org/training/fact-sheets/nutrient-management/item/potassium-k), “Potassium deficiency symptoms”; accessed 2026-08-13. |

The records are international scientific observation evidence, not Thai-local
fertilizer authority. Thai-local validation remains open. No fertilizer amount
or correction text from the sources enters the projection.

## Water and root relationships

The projection keeps field-water observation, root condition, and plant
response as separate Case fields. It reuses only governed relationships:

- `EV-RDC-011A/v1; EV-RDC-011B/v1` / `CL-RDC-011-I/C/O/v1`: root-knot
  comparison requires direct root-gall evidence and retains production context.
- `EV-RDC-012A/v1; EV-RDC-012B/v1` / `CL-RDC-012-I/C/O/v1`: the Akiochi
  comparison requires black-root and tillering-stage evidence and retains
  residue-decomposition and new-root observations.

Standing water, drying, wet-after-dry history, or uneven water distribution are
context, not causal conclusions.

## Chemical, application, environment, space, and time

Application history is user-reported Case evidence: method, date/time, product,
active ingredient if known, rate, water volume, mixture, prior applications,
conditions, water state, passes/overlap, and reported abnormal event. It can
prompt treated-versus-untreated and new-growth comparisons but cannot establish
chemical injury. Product/manufacturer evidence remains source-scoped context and
cannot establish independent causation, current Thai registration, or
recommendation eligibility.

Weather is contextual. No weather threshold or unsupported environmental cause
relationship is encoded. Spatial patterns—including field edge, water-associated
areas, and application-line/overlap-like patterns—are contextual. Temporal
comparison reuses the Sprint-079 T1/T2 projection; first noticed is not biological
onset, and temporal association is not causation.

## Output and next evidence

The bounded `rice-abiotic-differential/v1` projection can retain disease,
insect, nutrient, and water/root candidates and emit investigation states, not
diagnoses. Deterministic next observations compare affected and apparently
healthy hills, leaf age/order, roots, water history, application history, and
treated versus untreated areas where available.

Photo Missions remain human-confirmed at `FIELD`, `PLANT`, `ORGAN`, `DAMAGE`,
`COMPARISON`, and `APPLICATION_CONTEXT` scales. Photos are received but not
analyzed; there is no computer vision, color diagnosis, or automatic comparison.

## Explicit knowledge gaps

- **NUTRIENT:** Thai-local validation beyond the two IRRI relationships.
- **WATER / ROOT:** relationships beyond governed root-knot and Akiochi records.
- **ENVIRONMENT:** subject-specific heat, cold, radiation, cloudy, drought, and
  excessive-moisture causal relationships.
- **CHEMICAL INJURY:** product/active-specific crop injury relationships.
- **APPLICATION:** observations are Case evidence only.
- **RECOVERY:** condition-specific recovery indicators.
- **TEMPORAL CAUSALITY:** event order does not establish cause; latency is absent.
- **FIELD PATTERN:** causal interpretations remain unsupported.
- **THAI-LOCAL VALIDATION:** locally governed nutrient and abiotic relationships.

Need-for-action is not evaluated. Chemical review remains blocked. Regulatory
authority remains with the Sprint-076/077/077R chain.

# Management option and Case suitability intelligence

Status: accepted bounded Layer-④ decision intelligence; `not_published`

`management-case-suitability/v1` evaluates which management option classes are
reasonable to review after Need-for-Action. Suitability means relevance for
review, not an instruction or recommendation. Multiple classes may coexist.

The deterministic workflow considers `MONITORING`, `RE_INSPECTION`,
`CULTURAL_MANAGEMENT`, `MECHANICAL_MANAGEMENT`, `WATER_MANAGEMENT`,
`BIOLOGICAL_MANAGEMENT`, `CHEMICAL_MANAGEMENT_REVIEW`, `EXPERT_REVIEW`, and
`OTHER_GOVERNED_MANAGEMENT`. Each receives one of `SUPPORTED_FOR_REVIEW`,
`MORE_EVIDENCE_REQUIRED`, `NOT_SUPPORTED_BY_CURRENT_EVIDENCE`,
`BLOCKED_BY_AUTHORITY`, `HUMAN_REVIEW_REQUIRED`, or `NOT_APPLICABLE`.

Every option explains its reason, supporting and missing evidence, possible state
change, limitations, and Human Review requirement. Ordering is workflow ordering
only; it does not mean best, effective, preferred, ranked, or recommended.

Monitoring names the observation required but invents no interval. Re-inspection
supplies a concrete field mission. Cultural, mechanical, water, and biological
classes require a governed subject/context relationship; general model knowledge
cannot populate them. Field-water observation, water as a causal hypothesis,
water management, and product-specific water instructions remain separate.

Chemical-management review can be relevant only after management review is
justified. Sprint-083 regulatory Key B remains authoritative, so current priority
Cases are `BLOCKED_BY_AUTHORITY`; no product, active ingredient, rate, mixture,
program, or MoA switch is emitted.

The BPH slice asks for insects per plant when absent, supports monitoring below
the governed criterion, and reviews option classes when it is reached. The
leaffolder slice preserves Thai stage/incidence Action Evidence and historical-
damage separation. Disease, weed, and abiotic Cases retain missing Action or
management authority and favor monitoring, re-inspection, or expert review
without corrective prescriptions. Failed control cannot reopen selection before
Sprint-081 gaps are resolved. Weather and nearby fields remain contextual; drone
settings cannot confirm deposition.

The Case record preserves inputs, Need-for-Action, option states, evidence roles,
regulatory status, Human Review, provenance, categorized knowledge gaps, and
exactly one next decision question. It is browser-local and creates no execution
plan, schedule, drone mission, or Canonical Knowledge.

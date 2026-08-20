# Field Intelligence Workspace architecture contract

CP-MoAKB is a field intelligence workspace organized around the closed loop:

`Observe → Investigate → Understand → Decide → Execute → Learn`

The governed Knowledge, Decision, Evidence, Source, Validation, and Vocabulary
layers remain authoritative. Runtime field capabilities surround that brain;
they do not replace or duplicate it.

## KEEP

- The Python domain, registry, validation, query, serialization, import, and
  explanation packages as the governed knowledge foundation.
- The existing deterministic SP Assistant investigation assets and their
  explicit boundaries: Candidate is not Diagnosis, product evidence is not a
  Recommendation, and control failure is not resistance.
- Source and authority lineage, immutable identifiers, versioned records, and
  existing architecture tests.
- The static, local-first prototype delivery shape for this execution block.

## MODIFY

- Make the SP Assistant entry point field-centered while preserving the
  existing investigation workspace as a downstream screen.
- Move field identity, geometry, lifecycle calculations, and persistence behind
  application-service contracts instead of one-off UI handlers.
- Replace manual rice-age entry in the field workflow with date-derived age or
  future-planting countdown and explicit stage provenance.
- Extend prototype verification to cover the field workflow without weakening
  the existing governed decision checks.

## ADD

- Generic contracts for User, Field, Season, Activity, Case, Observation,
  Evidence, Conversation, Message, GuidanceItem, Recommendation,
  ManagementOption, DecisionLog, FollowUp, Outcome, Alert, and KnowledgeObject.
- FieldService, LocationService, MapService, StageService, GuidanceService,
  InvestigationService, EvidenceService, ConversationService,
  KnowledgeService, DecisionService, ExplanationService, and a server-only
  LLMGateway boundary.
- Mock login, non-blocking GPS permission, home shell, two-mode polygon drawing,
  field identity/details, calculated stage metadata, and local persistence.
- Automated unit, integration, persistence, identity-isolation, and architecture
  guardrail tests.

## DEPRECATE

- Display names as identity keys.
- Manual rice-age fields in the first-class field workflow.
- Scientific or regulatory conditionals in UI components.
- Browser access to databases, provider secrets, or the OpenAI API.
- Golden-slice-specific routing as a product architecture. Golden slices remain
  verification scenarios only.

## Permanent anti-hard-code rules

1. Knowledge is data, not application code.
2. Golden slices are tests, not architecture.
3. UI components contain no scientific or regulatory decision logic.
4. Do not hard-code individual pests, diseases, weeds, active ingredients,
   products, thresholds, rates, registrations, alert radii, crop stages, or
   drone parameters when the capability should be generic.
5. Candidate does not equal Diagnosis.
6. Observation does not equal confirmed cause.
7. Product evidence does not equal Recommendation.
8. User selection does not equal a Field Action performed.
9. Nearby risk does not equal a preventive spray recommendation.
10. An LLM is not a regulatory source of truth.
11. Browser code never exposes OpenAI API keys.
12. Governed outputs preserve evidence lineage.
13. Prefer data-, configuration-, and engine-driven behavior over entity-specific
    conditionals.
14. Any new entity-specific code path requires explicit written justification.
15. Field identity is based on stable IDs, never display names.

## Runtime boundaries

The modular-monolith runtime direction is:

`UI → Application Services → LLM Orchestrator → Governed Knowledge / Rules`

`Application Services → Persistent Case / Data → External API adapters`

UI code may request work from application services. It must not query storage,
evaluate governed scientific conditions, call an LLM provider, or manufacture
regulatory authority. The prototype repository adapter uses browser-local JSON
storage behind `WorkspaceRepository`; it can be replaced with a cloud adapter
without changing field UI contracts.

The stage model is loaded as versioned configuration. A calculated stage always
records its model, basis, and one of `SYSTEM_ESTIMATED`, `USER_CONFIRMED`, or
`USER_OVERRIDDEN`.

## Audit evidence

The pre-change audit found entity-specific governed data in
`decision-authority.js`, `decision-gates.js`, and related knowledge assets. That
material is retained because it is versioned authority/evidence data used by the
existing deterministic engine. The audit also found entity-oriented cue and
question routing inside the legacy browser investigation controller. It remains
operational for compatibility but is not copied into the new field layer; a
future block should move those cues into governed data and orchestrator
adapters. No direct OpenAI browser integration or exposed API key was found.

## Known transitional boundaries

- Browser-local persistence is a development adapter, not a production database.
- Weather is adapter-driven mock context until a governed provider integration is
  selected.
- The existing investigation controller is preserved, but its large single-file
  presentation/orchestration shape should be decomposed incrementally.
- The operational nine-stage CMP configuration is visible; alternative stage
  taxonomies stay backend-only until a later execution block.

## Execution Block 2 runtime

The first usable field-intelligence loop reuses the Block 1 repository and
service boundaries. `GuidanceService` creates field/season/user-scoped,
configuration-driven guidance; `InvestigationService` owns generic question
progression and persisted observations; `EvidenceService` records photo receipt
without claiming analysis; `ConversationService` enforces field- and case-scoped
conversation isolation; and `DecisionService` produces bounded management
options and selection-only `DecisionLog` records. The browser UI renders these
contracts and contains no scientific entity routing.

The generic flow definitions currently cover insect, disease, weed, and abiotic
inspection domains. They intentionally contain observation prompts rather than
entity diagnoses or treatment claims. The local `LLMGateway` has no provider and
reports an unavailable state without blocking the deterministic workflow.

Remaining legacy debt is confined to the separately routed legacy investigation
controller and its entity-oriented cues. It is retained as a compatibility
screen and should continue to be strangled behind governed flow and knowledge
adapters rather than rewritten into a second architecture.

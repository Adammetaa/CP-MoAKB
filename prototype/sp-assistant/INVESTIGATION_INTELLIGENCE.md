# Governed Investigation Intelligence Runtime

## Purpose and authority

The Step C runtime derives a structured, explainable investigation assessment
from one server-authoritative Investigation Bundle. It answers which explicitly
authored Candidates remain supportable, what bears for or against them, what is
missing, whether the evidence is sufficient for a declared purpose, and which
single evidence request is most useful next.

The runtime is not a diagnosis engine. Candidate ordering is stable-identifier
ordering only and carries no rank. No score, probability, product selection,
rate, recommendation, or conversational wording is produced.

The flow is:

`Authoritative Bundle -> Persisted Candidates -> Explicit Relations/Rules -> Compatibility -> Gaps -> Sufficiency -> One Next Best Evidence -> Stop/Escalation`

Browser drafts do not enter this flow. `DRAFT_LOCAL`, `PENDING_SYNC`,
`SYNC_FAILED`, and `CONFLICT` remain non-authoritative until synchronized and
returned by the server backbone.

## Candidate and relation model

Only Candidates already persisted as explicitly authored hypotheses are
assessed. The default provider creates no Candidates. A narrow server-side rule
provider can add bounded adjudication relationships when each provider declares
`PERSISTED_EXPLICIT_RELATIONS`, `GOVERNED_KNOWLEDGE_RELATIONSHIP`, or
`BOUNDED_RUNTIME_RULE` authority plus an honest `EXPLICITLY_AUTHORED`,
`HUMAN_REVIEWED`, or `DOMAIN_APPROVED` review state. Persisted links default to
`EXPLICITLY_AUTHORED`; the runtime does not silently upgrade them to reviewed.
Every rule also has a stable ID, version, exact Candidate, compatibility
dimension, categorical constraint, reason, and source records that exist in the
same authoritative bundle.

Assessment states are `OPEN`, `INSUFFICIENT`, `SUPPORTED`, `WEAKENED`,
`STRONGLY_SUPPORTED`, `REQUIRES_EXPERT_REVIEW`, `RESOLVED`, and
`NOT_SUPPORTED`. `RESOLVED` is never selected because a Candidate merely has
more support; it requires the persisted human-reviewed resolution basis.
`NOT_SUPPORTED` is an assessment state and does not mean biological
impossibility. It was not added to Candidate persistence because Step C does not
rewrite the authored hypothesis.

Relations are `SUPPORTS`, `WEAKLY_SUPPORTS`, `NEUTRAL`, `CONTRADICTS`,
`STRONGLY_CONTRADICTS`, `REQUIRED_BUT_MISSING`, and `NOT_APPLICABLE`.
Persisted Step A links map deterministically to these relations. Duplicate links
to the same Candidate, source, dimension, and relation collapse to one output
relationship; there is no hidden counting or weighting.

Every emitted relationship retains the source record ID and type, reason,
constraint (`REQUIRED`, `TYPICAL`, `COMMON`, `POSSIBLE`, or
`CONTRADICTORY`), compatibility dimension, and rule/link reference.

## Compatibility and negative evidence

Compatibility remains separate across `BIOLOGICAL_STAGE`, `SPATIAL`,
`MORPHOLOGY`, `SEVERITY`, `SAMPLING`, `ENVIRONMENT`,
`MANAGEMENT_HISTORY`, `ABIOTIC`, `TEMPORAL`, and `VISUAL`. Each dimension is
categorical: `SUPPORTIVE`, `NEUTRAL`, `CONTRADICTORY`, or `UNKNOWN`.
Support and contradiction in one dimension become an explicit neutral/conflict
uncertainty; they are not averaged.

Negative-evidence rules are safe by construction. `SEARCHED_NOT_FOUND` can bear
against a Candidate only when the target was observable, a search method is
recorded, and the governed rule declares that method appropriate.
`NOT_OBSERVED`, `NOT_ASSESSABLE`, and `UNKNOWN` remain non-dispositive.
Absence of requested material remains a gap, not negative evidence.

Temporal incompatibility is consumed only through an explicit rule linked to an
authoritative temporal relationship. It may weaken a Candidate such as an
application-origin hypothesis when symptom evidence predates the event, but it
does not establish an alternate cause.

## Sufficiency and Next Best Evidence

Sufficiency is categorical and purpose-specific:

- `INSUFFICIENT_FOR_NARROWING`;
- `SUFFICIENT_FOR_NARROWING`;
- `SUFFICIENT_FOR_MANAGEMENT_OPTION_REVIEW`;
- `SUFFICIENT_FOR_HUMAN_FINDING`;
- `REQUIRES_SPECIALIST_CONFIRMATION`; or
- `UNRESOLVABLE_WITH_CURRENT_FIELD_EVIDENCE`.

Narrowing never implies management readiness or a reviewed finding. The default
operational rule can recognize that explicit relations differentiate part of a
multi-Candidate set, but only a governed rule provider may declare stronger
purpose readiness.

Next Best Evidence is one structured request, never an interrogation script.
Types are `QUESTION`, `PHOTO`, `FIELD_CHECK`, `SAMPLING`, `COUNT`,
`MEASUREMENT`, `COMPARISON_SITE`, `MANAGEMENT_RECORD`, `WEATHER_CONTEXT`,
`EXPERT_REVIEW`, and `LAB_TEST`. Each request carries target, purpose,
discrimination goal, `HIGH`/`MEDIUM`/`LOW` value, reason, Candidate IDs, gap
references, and an optional completion condition. Selection prefers the highest
categorical value, discrimination across competitors, and the appropriate
field evidence type. It emits no fabricated information-gain number.

## Stop and unresolved outcomes

Stop conditions are `ENOUGH_FOR_CURRENT_DECISION`, `USER_DECLINED`,
`EXPERT_REVIEW_REQUIRED`, `LAB_EVIDENCE_REQUIRED`,
`FIELD_EVIDENCE_EXHAUSTED`, and `CASE_RESOLVED`. A stop suppresses further
ordinary questions. Expert or laboratory handoff may remain as the one next
request when that is the stop destination.

`NO_CANDIDATES_AVAILABLE`, `INSUFFICIENT_EVIDENCE`,
`NO_DISCRIMINATING_NEXT_STEP`, and `UNRESOLVED` are governed results, not server
errors. Multiple supported Candidates may coexist. The engine never assigns
`PRIMARY_FINDING`, `CONTRIBUTING_FACTOR`, or `COEXISTING_CONDITION`; those roles
require an attributed human review.

## Assessment persistence and invalidation

The service derives a canonical SHA-256 hash from scientific bundle content and
a separate hash/version for the bounded rules. A snapshot records those hashes,
rule version, rule authority/review state, generation time, and monotonically
increasing assessment revision. Unchanged inputs replay the current snapshot.

Evidence, Candidate link, Candidate, or StageAssessment changes alter the
source hash and make the prior snapshot stale. Rule content or version changes
also produce a new assessment. Historical snapshots and their reviews remain
available; stale snapshots cannot receive new review actions.

Only assessment snapshots and review history are persisted. Evidence is not
copied into a second intelligence store.

## Human review

Review actions are `ACCEPT`, `CORRECT`, `REQUEST_MORE_EVIDENCE`,
`MARK_UNRESOLVED`, and `RESOLVE_FINDING`. Reviews retain reviewer identity,
rationale, structured corrections, optional resolution level, attributed
Candidate roles, source assessment revision, and time.

Corrections never overwrite the engine snapshot. Resolution levels remain
distinct: `FIELD_PLAUSIBLE`, `FIELD_SUPPORTED`,
`FIELD_STRONGLY_SUPPORTED`, `FIELD_REVIEWED_FINDING`,
`SPECIALIST_CONFIRMED`, `LAB_CONFIRMED`, and
`AUTHORITY_REFERENCE_MATCH`. Review records explicitly prohibit automatic
promotion into Diagnosis, Claim, Recommendation, or published knowledge.

## Service and API

`PilotStore` exposes:

- `assessInvestigation(userId, scope)`;
- `getInvestigationAssessmentHistory(userId, scope)`; and
- `reviewInvestigationAssessment(userId, review)`.

Authenticated HTTP routes are:

- `GET /api/pilot/investigation-assessment`;
- `GET /api/pilot/investigation-assessment-history`; and
- `POST /api/pilot/investigation-assessment-reviews`.

The session supplies authoritative ownership. The assessment endpoint accepts
only Field, Season, and Case scope; it cannot accept browser evidence or a
client-supplied assessment bundle.

## Knowledge and compatibility boundaries

The existing browser `decision-gates.js` remains a legacy governed vertical
slice and is not treated as the server Step C authority. Its browser cues and
entity-specific profiles are not copied into the new engine. The default Step C
provider adjudicates persisted links only. Broad scientific Candidate/rule
population awaits a separately reviewed knowledge-package integration.

The Capture Adapter, legacy workspace collections, current chat gateway, and
Field Lifecycle remain unchanged. Future Chat/OpenAI orchestration may translate
this structured result into natural Thai, but it cannot adjudicate evidence.
Future Guidance may consume a request such as `ROOT_COMPARISON`; Step C does not
turn it into operational dialog or a daily task.

## Explicit non-goals

No Candidate invention from user text, free knowledge search, or images; no
computer vision; no diagnosis; no numerical ranking; no OpenAI reasoning; no
Guidance Intelligence; no pesticide, fertilizer, active-ingredient, product, or
rate selection; no management action; no resistance conclusion; no cross-field
pattern inference; no automatic learning or publication; and no deployment or
release are implemented here.

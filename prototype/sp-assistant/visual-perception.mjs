import { createHash, randomUUID } from "node:crypto";
import { InvestigationContractError, INVESTIGATION_ENUMS } from "./investigation-backbone.mjs";
import { VISUAL_EVIDENCE_ENUMS, VISUAL_VOCABULARY_VERSION } from "./visual-evidence.mjs";

export const VISUAL_PERCEPTION_RUNTIME_VERSION = "governed-visual-perception/v1";
export const VISUAL_PERCEPTION_REQUEST_VERSION = "governed-visual-perception-request/v1";
export const VISUAL_PERCEPTION_RESULT_VERSION = "governed-visual-perception-result/v1";

export const VISUAL_PERCEPTION_ENUMS = Object.freeze({
  providerTypes: ["NO_PROVIDER", "TEST_ONLY_VISUAL_PERCEPTION_PROVIDER", "MANUAL_STRUCTURED_PROVIDER", "NETWORK_MULTIMODAL_PROVIDER"],
  requestStates: ["QUEUED", "RUNNING", "COMPLETED", "FAILED", "REJECTED", "SUPERSEDED"],
  failureCategories: ["NETWORK_TIMEOUT", "NETWORK_UNAVAILABLE", "AUTH_CONFIGURATION_ERROR", "UNSUPPORTED_MEDIA", "IMAGE_TOO_LARGE", "MALFORMED_PROVIDER_OUTPUT", "SCHEMA_VALIDATION_FAILED", "VOCABULARY_VALIDATION_FAILED", "PROVIDER_POLICY_REJECTION", "UNKNOWN_PROVIDER_ERROR"],
  outcomes: ["PERCEPTION_COMPLETE", "BETTER_VIEW_REQUIRED", "TARGET_NOT_VISUALLY_ASSESSABLE", "FIELD_CHECK_REQUIRED", "COUNT_REQUIRED", "MEASUREMENT_REQUIRED", "EXPERT_REVIEW_REQUIRED", "LAB_EVIDENCE_REQUIRED", "PERCEPTION_UNAVAILABLE"],
  providerFeatureStates: ["OBSERVED", "NOT_OBSERVED", "NOT_ASSESSABLE", "UNKNOWN"],
  objectScopes: ["IMAGE_FRAME", "SAMPLED_OBJECT", "SAMPLED_PLANT_PART", "VISIBLE_OBJECT"],
});

const E = Object.fromEntries(Object.entries(VISUAL_PERCEPTION_ENUMS).map(([key, values]) => [key, new Set(values)]));
const QUALITY_DIMENSIONS = new Set(VISUAL_EVIDENCE_ENUMS.qualityDimensions);
const QUALITY_VALUES = new Set(VISUAL_EVIDENCE_ENUMS.qualityValues);
const OBSERVABILITY_STATES = new Set(VISUAL_EVIDENCE_ENUMS.observabilityStates);
const FEATURES = new Set(INVESTIGATION_ENUMS.phenotypes);
const PLANT_PARTS = new Set(INVESTIGATION_ENUMS.plantParts);
const SPATIAL_SCOPES = new Set(VISUAL_EVIDENCE_ENUMS.spatialScopes);
const COMPARISON_ROLES = new Set(VISUAL_EVIDENCE_ENUMS.comparisonRoles);
const SPATIAL_RANK = new Map([["SAMPLED_OBJECT", 0], ["PLANT", 1], ["TILLER_HILL", 1], ["LOCAL_SITE", 2], ["PATCH", 3], ["ZONE", 4], ["FIELD_CONTEXT", 5], ["UNKNOWN", -1]]);
const SAFE_MEDIA_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const REJECTION_CATEGORIES = new Set(["MALFORMED_PROVIDER_OUTPUT", "SCHEMA_VALIDATION_FAILED", "VOCABULARY_VALIDATION_FAILED", "PROVIDER_POLICY_REJECTION"]);
const FORBIDDEN_KEYS = /(?:^|_)(diagnosis|diagnostic|probability|confidence|candidate|treatment|fungicide|insecticide|herbicide|fertilizer|active_ingredient|commercial_product|product|dose|rate|resistance|economic_threshold|field_severity|field_prevalence|causal|cause)(?:_|$)/i;
const FORBIDDEN_TEXT = /(?:โรคไหม้|เพลี้ยกระโดดสีน้ำตาล|tricyclazole|เพิ่มโดส|diagnos(?:is|e)|probabilit|candidate\s+(?:supported|weakened|resolved)|treat(?:ment)?|fungicide|insecticide|herbicide|fertilizer recommendation|active ingredient|commercial product|dose|resistance|economic threshold|field[- ]wide severity|causal agent)/i;

const canonical = (value) => Array.isArray(value)
  ? `[${value.map(canonical).join(",")}]`
  : value && typeof value === "object"
    ? `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(",")}}`
    : JSON.stringify(value);
const hash = (value) => createHash("sha256").update(canonical(value)).digest("hex");
const fail = (message, code = "VALIDATION_ERROR", status = code === "AUTHORIZATION_ERROR" ? 403 : 400) => { throw new InvestigationContractError(message, code, status); };
const object = (value, name) => { if (!value || typeof value !== "object" || Array.isArray(value)) fail(`${name} must be an object`); return value; };
const exactKeys = (value, keys, name) => { const extra = Object.keys(value).filter((key) => !keys.includes(key)); if (extra.length) fail(`${name} contains unsupported field: ${extra[0]}`); };
const identifier = (value, name, { optional = false, max = 200 } = {}) => { if (optional && value == null) return null; if (typeof value !== "string" || !new RegExp(`^[A-Za-z0-9._:/-]{1,${max}}$`).test(value)) fail(`invalid ${name}`); return value; };
const token = (value, name, { optional = false } = {}) => { if (optional && value == null) return null; if (typeof value !== "string" || !/^[A-Z][A-Z0-9_]{0,99}$/.test(value)) fail(`invalid ${name}`); return value; };
const boundedText = (value, name, { optional = false, max = 1_000 } = {}) => { if (optional && value == null) return null; if (typeof value !== "string" || !value.trim() || value.length > max) fail(`invalid ${name}`); return value.trim(); };
const member = (value, set, name) => { if (!set.has(value)) fail(`invalid ${name}`); return value; };
const isoTimestamp = (value, name, fallback) => { const selected = value ?? fallback; if (typeof selected !== "string" || !Number.isFinite(Date.parse(selected))) fail(`invalid ${name}`); return new Date(selected).toISOString(); };

export class VisualPerceptionError extends Error {
  constructor(category, message) {
    super(message);
    this.name = "VisualPerceptionError";
    this.category = member(category, E.failureCategories, "failure category");
  }
}

export class VisualPerceptionProvider {
  constructor({ providerId = "visual-perception-unavailable", providerVersion = "none", providerType = "NO_PROVIDER", available = false, networkCalls = false, requiresImageData = false, allowTestOnly = false } = {}) {
    this.providerId = identifier(providerId, "provider_id");
    this.providerVersion = identifier(providerVersion, "provider_version");
    this.providerType = member(providerType, E.providerTypes, "provider_type");
    this.available = available === true;
    this.networkCalls = networkCalls === true;
    this.requiresImageData = requiresImageData === true;
    if (this.providerType === "TEST_ONLY_VISUAL_PERCEPTION_PROVIDER" && !allowTestOnly) fail("TEST_ONLY_VISUAL_PERCEPTION_PROVIDER cannot load in normal runtime");
  }

  getManifest() {
    return {
      provider_id: this.providerId,
      provider_version: this.providerVersion,
      provider_type: this.providerType,
      available: this.available,
      network_calls: this.networkCalls,
      requires_image_data: this.requiresImageData,
      server_side_only: true,
      authoritative_state_owner: false,
    };
  }

  async analyzeImage() {
    throw new VisualPerceptionError("AUTH_CONFIGURATION_ERROR", "visual perception provider is not configured");
  }
}

export class ManualStructuredVisualPerceptionProvider extends VisualPerceptionProvider {
  constructor({ providerVersion = "manual-structured/v1" } = {}) {
    super({ providerId: "manual-structured-visual-perception", providerVersion, providerType: "MANUAL_STRUCTURED_PROVIDER", available: true });
  }

  async analyzeImage({ manualProposal }) {
    if (!manualProposal) throw new VisualPerceptionError("MALFORMED_PROVIDER_OUTPUT", "manual structured proposal is required");
    return structuredClone(manualProposal);
  }
}

export function createTestOnlyVisualPerceptionAdapter(proposal, { providerVersion = "test-only/v1" } = {}) {
  return new class extends VisualPerceptionProvider {
    constructor() {
      super({ providerId: "deterministic-visual-perception-fixture", providerVersion, providerType: "TEST_ONLY_VISUAL_PERCEPTION_PROVIDER", available: true, allowTestOnly: true });
    }

    async analyzeImage(input) {
      const value = typeof proposal === "function" ? await proposal(structuredClone(input)) : proposal;
      return structuredClone(value);
    }
  }();
}

function extractResponseText(response) {
  return (response?.output ?? [])
    .flatMap((item) => item?.content ?? [])
    .filter((item) => item?.type === "output_text")
    .map((item) => item.text)
    .join("\n")
    .trim();
}

function openAiOutputSchema() {
  const nullableReason = { type: ["string", "null"], maxLength: 500 };
  return {
    type: "object",
    additionalProperties: false,
    required: ["quality", "observability", "visible_features", "limitations", "provider_generated_at"],
    properties: {
      quality: { type: "array", items: { type: "object", additionalProperties: false, required: ["dimension", "categorical_state", "reason"], properties: { dimension: { type: "string", enum: [...QUALITY_DIMENSIONS] }, categorical_state: { type: "string", enum: [...QUALITY_VALUES] }, reason: nullableReason } } },
      observability: { type: "array", minItems: 1, items: { type: "object", additionalProperties: false, required: ["concept", "state", "reason"], properties: { concept: { type: "string", pattern: "^[A-Z][A-Z0-9_]{0,99}$" }, state: { type: "string", enum: [...OBSERVABILITY_STATES] }, reason: nullableReason } } },
      visible_features: { type: "array", items: { type: "object", additionalProperties: false, required: ["concept_id", "state", "plant_part_scope", "spatial_scope", "object_scope", "observability_target", "comparison_role", "visible_count", "reason"], properties: { concept_id: { type: "string", enum: [...FEATURES] }, state: { type: "string", enum: [...E.providerFeatureStates] }, plant_part_scope: { type: "string", enum: [...PLANT_PARTS] }, spatial_scope: { type: "string", enum: [...SPATIAL_SCOPES] }, object_scope: { type: "string", enum: [...E.objectScopes] }, observability_target: { type: "string", pattern: "^[A-Z][A-Z0-9_]{0,99}$" }, comparison_role: { type: ["string", "null"], enum: [...COMPARISON_ROLES, null] }, visible_count: { type: ["integer", "null"], minimum: 0 }, reason: nullableReason } } },
      limitations: { type: "array", items: { type: "string", minLength: 1, maxLength: 500 } },
      provider_generated_at: { type: "string" },
    },
  };
}

export class OpenAIVisualPerceptionProvider extends VisualPerceptionProvider {
  constructor({ apiKey, model = "gpt-5.6-luna", fetcher = globalThis.fetch, timeoutMs = 20_000, maxImageBytes = 6_000_000, clock = () => new Date() } = {}) {
    super({ providerId: "openai-responses-visual-perception", providerVersion: identifier(model, "model"), providerType: "NETWORK_MULTIMODAL_PROVIDER", available: Boolean(apiKey && !apiKey.startsWith("YOUR_")), networkCalls: true, requiresImageData: true });
    this.apiKey = apiKey;
    this.model = model;
    this.fetcher = fetcher;
    this.timeoutMs = timeoutMs;
    this.maxImageBytes = maxImageBytes;
    this.clock = clock;
  }

  async analyzeImage({ imageEvidence, requestedVisualTarget, authoritativeContext, allowedVisualVocabulary, imagePayload }) {
    if (!this.available) throw new VisualPerceptionError("AUTH_CONFIGURATION_ERROR", "OpenAI visual perception is not configured");
    if (!imagePayload?.bytes || !SAFE_MEDIA_TYPES.has(imagePayload.media_type)) throw new VisualPerceptionError("UNSUPPORTED_MEDIA", "visual perception requires a supported server-side image");
    if (imagePayload.bytes.length > this.maxImageBytes) throw new VisualPerceptionError("IMAGE_TOO_LARGE", "image exceeds the configured perception limit");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const body = {
      model: this.model,
      store: false,
      temperature: 0,
      instructions: "You are a visual observation extractor. Return only directly visible features using the supplied vocabulary. Do not diagnose disease, identify a causal agent, rank causes, estimate probabilities or field prevalence, recommend treatment, or identify products. If the requested target cannot be assessed, return NOT_ASSESSABLE or NOT_IN_VIEW. Absence of visibility is not evidence of absence.",
      input: [{ role: "user", content: [
        { type: "input_text", text: JSON.stringify({ requested_visual_target: requestedVisualTarget, minimum_necessary_context: authoritativeContext, allowed_visual_vocabulary: allowedVisualVocabulary }) },
        { type: "input_image", image_url: `data:${imagePayload.media_type};base64,${imagePayload.bytes.toString("base64")}`, detail: "high" },
      ] }],
      text: { format: { type: "json_schema", name: "governed_visual_perception", strict: true, schema: openAiOutputSchema() } },
    };
    try {
      const response = await this.fetcher("https://api.openai.com/v1/responses", { method: "POST", headers: { authorization: `Bearer ${this.apiKey}`, "content-type": "application/json" }, body: JSON.stringify(body), signal: controller.signal });
      if (!response.ok) {
        if ([401, 403].includes(response.status)) throw new VisualPerceptionError("AUTH_CONFIGURATION_ERROR", "visual perception provider authentication failed");
        if (response.status === 413 || response.status === 415) throw new VisualPerceptionError(response.status === 413 ? "IMAGE_TOO_LARGE" : "UNSUPPORTED_MEDIA", "visual perception provider rejected the image");
        throw new VisualPerceptionError("NETWORK_UNAVAILABLE", "visual perception provider is unavailable");
      }
      let payload;
      try { payload = await response.json(); } catch { throw new VisualPerceptionError("MALFORMED_PROVIDER_OUTPUT", "visual perception provider returned invalid JSON"); }
      const output = extractResponseText(payload);
      if (!output) throw new VisualPerceptionError("MALFORMED_PROVIDER_OUTPUT", "visual perception provider returned no structured output");
      let parsed;
      try { parsed = JSON.parse(output); } catch { throw new VisualPerceptionError("MALFORMED_PROVIDER_OUTPUT", "visual perception provider output was not structured JSON"); }
      return { ...parsed, raw_provider_reference: payload.id ?? null, provider_generated_at: parsed.provider_generated_at ?? this.clock().toISOString() };
    } catch (error) {
      if (error instanceof VisualPerceptionError) throw error;
      if (controller.signal.aborted || error?.name === "AbortError") throw new VisualPerceptionError("NETWORK_TIMEOUT", "visual perception provider timed out");
      throw new VisualPerceptionError("NETWORK_UNAVAILABLE", "visual perception provider network request failed");
    } finally {
      clearTimeout(timeout);
    }
  }
}

export function createConfiguredVisualPerceptionProvider({ env = process.env, fetcher = globalThis.fetch } = {}) {
  const selected = env.VISUAL_PERCEPTION_PROVIDER ?? "DISABLED";
  if (selected === "OPENAI") return new OpenAIVisualPerceptionProvider({ apiKey: env.OPENAI_API_KEY, model: env.OPENAI_VISUAL_MODEL ?? env.OPENAI_MODEL ?? "gpt-5.6-luna", fetcher, timeoutMs: Number(env.VISUAL_PERCEPTION_TIMEOUT_MS ?? 20_000), maxImageBytes: Number(env.VISUAL_PERCEPTION_MAX_IMAGE_BYTES ?? 6_000_000) });
  if (selected === "MANUAL_STRUCTURED") return new ManualStructuredVisualPerceptionProvider();
  return new VisualPerceptionProvider();
}

export function initializeVisualPerceptionSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS visual_perception_requests (
      analysis_request_id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL,
      image_evidence_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      provider_version TEXT NOT NULL,
      requested_target TEXT NOT NULL,
      context_hash TEXT NOT NULL,
      vocabulary_version TEXT NOT NULL,
      reuse_key TEXT NOT NULL,
      status TEXT NOT NULL,
      failure_category TEXT,
      result_id TEXT,
      request_json TEXT NOT NULL,
      queued_at TEXT NOT NULL,
      started_at TEXT,
      completed_at TEXT,
      FOREIGN KEY(image_evidence_id) REFERENCES image_evidence(image_evidence_id)
    );
    CREATE INDEX IF NOT EXISTS visual_perception_reuse ON visual_perception_requests(owner_user_id,reuse_key,status);
    CREATE INDEX IF NOT EXISTS visual_perception_history ON visual_perception_requests(owner_user_id,image_evidence_id,queued_at,analysis_request_id);
    CREATE TABLE IF NOT EXISTS visual_perception_results (
      perception_result_id TEXT PRIMARY KEY,
      analysis_request_id TEXT NOT NULL UNIQUE,
      owner_user_id TEXT NOT NULL,
      image_evidence_id TEXT NOT NULL,
      result_hash TEXT NOT NULL,
      result_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(analysis_request_id) REFERENCES visual_perception_requests(analysis_request_id),
      FOREIGN KEY(image_evidence_id) REFERENCES image_evidence(image_evidence_id)
    );
  `);
  db.prepare("INSERT OR IGNORE INTO investigation_schema_migrations(version,applied_at) VALUES(7,?)").run(new Date().toISOString());
}

function assertNoForbiddenProviderContent(value, path = "provider_output") {
  if (Array.isArray(value)) return value.forEach((entry, index) => assertNoForbiddenProviderContent(entry, `${path}[${index}]`));
  if (!value || typeof value !== "object") return;
  for (const [key, entry] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.test(key)) throw new VisualPerceptionError("PROVIDER_POLICY_REJECTION", `prohibited provider field at ${path}.${key}`);
    if (["reason", "limitations"].includes(key) && typeof entry === "string" && FORBIDDEN_TEXT.test(entry)) throw new VisualPerceptionError("PROVIDER_POLICY_REJECTION", `prohibited provider statement at ${path}.${key}`);
    assertNoForbiddenProviderContent(entry, `${path}.${key}`);
  }
}

function assertMinimumNecessaryContext(value, path = "minimum_context") {
  if (Array.isArray(value)) return value.forEach((entry, index) => assertMinimumNecessaryContext(entry, `${path}[${index}]`));
  if (!value || typeof value !== "object") return;
  for (const [key, entry] of Object.entries(value)) {
    if (/candidate|diagnosis|treatment|product|purchase|phone|user_name|display_name|management_history|case_history/i.test(key)) fail(`minimum context contains prohibited field: ${path}.${key}`);
    assertMinimumNecessaryContext(entry, `${path}.${key}`);
  }
}

function validateProviderOutput(raw, { image, request, providerManifest, now }) {
  try { object(raw, "provider output"); } catch { throw new VisualPerceptionError("MALFORMED_PROVIDER_OUTPUT", "provider output must be a structured object"); }
  assertNoForbiddenProviderContent(raw);
  const keys = ["image_evidence_id", "provider_id", "provider_version", "analysis_request_id", "requested_target", "quality", "observability", "visible_features", "limitations", "raw_provider_reference", "provider_generated_at"];
  if (Object.keys(raw).some((key) => !keys.includes(key))) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", `provider output contains unsupported field: ${Object.keys(raw).find((key) => !keys.includes(key))}`);
  const exactIdentity = (provided, expected, name) => { if (provided != null && provided !== expected) throw new VisualPerceptionError("PROVIDER_POLICY_REJECTION", `${name} does not match the server request`); return expected; };
  const qualityInput = raw.quality;
  if (!Array.isArray(qualityInput)) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", "quality must be an array");
  const quality = qualityInput.map((entry, index) => {
    try { object(entry, `quality[${index}]`); exactKeys(entry, ["dimension", "categorical_state", "reason"], `quality[${index}]`); } catch { throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", `invalid quality proposal at index ${index}`); }
    if (!QUALITY_DIMENSIONS.has(entry.dimension) || !QUALITY_VALUES.has(entry.categorical_state)) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", "quality must use governed categorical values");
    return { dimension: entry.dimension, categorical_state: entry.categorical_state, reason: entry.reason == null ? null : boundedText(entry.reason, "quality reason", { max: 500 }) };
  });
  if (new Set(quality.map((entry) => entry.dimension)).size !== quality.length) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", "quality dimensions must be unique");
  if (!Array.isArray(raw.observability) || !raw.observability.length) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", "observability must contain the requested target");
  const observability = raw.observability.map((entry, index) => {
    try { object(entry, `observability[${index}]`); exactKeys(entry, ["concept", "state", "reason"], `observability[${index}]`); } catch { throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", `invalid observability proposal at index ${index}`); }
    try { return { concept: token(entry.concept, "observability concept"), state: member(entry.state, OBSERVABILITY_STATES, "observability state"), reason: entry.reason == null ? null : boundedText(entry.reason, "observability reason", { max: 500 }) }; } catch { throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", `invalid observability proposal at index ${index}`); }
  });
  if (!observability.some((entry) => entry.concept === request.requested_target)) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", "requested target observability is required");
  const observabilityByTarget = new Map(observability.map((entry) => [entry.concept, entry]));
  if (!Array.isArray(raw.visible_features)) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", "visible_features must be an array");
  const visibleFeatures = raw.visible_features.map((entry, index) => {
    try { object(entry, `visible_features[${index}]`); exactKeys(entry, ["concept_id", "state", "plant_part_scope", "spatial_scope", "object_scope", "observability_target", "comparison_role", "visible_count", "reason"], `visible_features[${index}]`); } catch { throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", `invalid visible feature proposal at index ${index}`); }
    if (!FEATURES.has(entry.concept_id)) throw new VisualPerceptionError("VOCABULARY_VALIDATION_FAILED", `VISUAL_VOCABULARY_GAP: ${entry.concept_id}`);
    try {
      const state = member(entry.state, E.providerFeatureStates, "feature state"), plantPart = member(entry.plant_part_scope, PLANT_PARTS, "plant part scope"), spatialScope = member(entry.spatial_scope, SPATIAL_SCOPES, "spatial scope"), objectScope = member(entry.object_scope, E.objectScopes, "object scope"), target = token(entry.observability_target, "feature observability target"), comparisonRole = entry.comparison_role == null ? image.comparison_role : member(entry.comparison_role, COMPARISON_ROLES, "comparison role");
      if (comparisonRole !== image.comparison_role) throw new VisualPerceptionError("PROVIDER_POLICY_REJECTION", "provider cannot assign or change affected/normal comparison role");
      const imageRank = SPATIAL_RANK.get(image.spatial_scope), proposalRank = SPATIAL_RANK.get(spatialScope);
      if (imageRank < 0 || proposalRank > imageRank) throw new VisualPerceptionError("PROVIDER_POLICY_REJECTION", "provider proposal exceeds the image spatial scope");
      const targetObservability = observabilityByTarget.get(target);
      if (!targetObservability) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", "each visible feature requires an observability proposal");
      if (["NOT_ASSESSABLE", "NOT_IN_VIEW", "OBSCURED", "INSUFFICIENT_SCALE"].includes(targetObservability.state) && ["OBSERVED", "NOT_OBSERVED"].includes(state)) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", "feature proposal is incompatible with target observability");
      if (entry.visible_count != null && (!Number.isInteger(entry.visible_count) || entry.visible_count < 0)) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", "visible count must be a non-negative integer");
      return { concept_id: entry.concept_id, state, plant_part_scope: plantPart, spatial_scope: spatialScope, object_scope: objectScope, observability_target: target, comparison_role: comparisonRole, visible_count: entry.visible_count ?? null, count_basis: entry.visible_count == null ? null : "IMAGE_FRAME_ONLY", reason: entry.reason == null ? null : boundedText(entry.reason, "feature reason", { max: 500 }) };
    } catch (error) {
      if (error instanceof VisualPerceptionError) throw error;
      throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", `invalid visible feature proposal at index ${index}`);
    }
  });
  if (!Array.isArray(raw.limitations)) throw new VisualPerceptionError("SCHEMA_VALIDATION_FAILED", "limitations must be an array");
  const limitations = raw.limitations.map((entry) => boundedText(entry, "limitation", { max: 500 }));
  if (limitations.some((entry) => FORBIDDEN_TEXT.test(entry))) throw new VisualPerceptionError("PROVIDER_POLICY_REJECTION", "provider limitation contains prohibited authority");
  const generatedAt = isoTimestamp(raw.provider_generated_at, "provider_generated_at", now);
  return {
    image_evidence_id: exactIdentity(raw.image_evidence_id, image.image_evidence_id, "image_evidence_id"),
    provider_id: exactIdentity(raw.provider_id, providerManifest.provider_id, "provider_id"),
    provider_version: exactIdentity(raw.provider_version, providerManifest.provider_version, "provider_version"),
    request_version: VISUAL_PERCEPTION_REQUEST_VERSION,
    analysis_request_id: exactIdentity(raw.analysis_request_id, request.analysis_request_id, "analysis_request_id"),
    requested_target: exactIdentity(raw.requested_target, request.requested_target, "requested_target"),
    quality,
    observability,
    visible_features: visibleFeatures,
    limitations,
    raw_provider_reference: raw.raw_provider_reference == null ? null : identifier(raw.raw_provider_reference, "raw_provider_reference"),
    provider_generated_at: generatedAt,
    boundaries: { proposal_is_human_review:false, proposal_is_investigation_evidence:false, proposal_is_diagnosis:false, not_observed_is_absence:false, field_wide_inference:false, training_eligible:false },
  };
}

function toB1Assessment(result, providerType) {
  return {
    quality: Object.fromEntries(result.quality.map((entry) => [entry.dimension, entry.categorical_state])),
    observability: result.observability.map((entry) => ({ target:entry.concept, state:entry.state, basis:entry.reason, appropriate_view:["ASSESSABLE", "PARTIALLY_ASSESSABLE"].includes(entry.state) })),
    features: result.visible_features.map((entry) => ({ feature_code:entry.concept_id, state:entry.state, review_basis:entry.reason, visible_count:entry.visible_count, count_method:entry.visible_count == null ? null : "PROVIDER_IMAGE_FRAME", assessability_target:entry.observability_target, plant_part_scope:entry.plant_part_scope, spatial_scope:entry.spatial_scope, object_scope:entry.object_scope, comparison_role:entry.comparison_role })),
    assessment_method: providerType,
    assessment_version: VISUAL_PERCEPTION_RESULT_VERSION,
  };
}

function safeRequestRecord(row) {
  return { ...JSON.parse(row.request_json), status:row.status, failure_category:row.failure_category, result_id:row.result_id, started_at:row.started_at, completed_at:row.completed_at };
}

export class VisualPerceptionService {
  constructor(db, visualEvidence, { provider = new VisualPerceptionProvider(), clock = () => new Date(), idProvider = () => randomUUID(), imageLoader = null, contextResolver = null, vocabularyVersion = VISUAL_VOCABULARY_VERSION } = {}) {
    this.db = db;
    this.visualEvidence = visualEvidence;
    this.provider = provider;
    this.clock = clock;
    this.idProvider = idProvider;
    this.imageLoader = imageLoader;
    this.contextResolver = contextResolver;
    this.vocabularyVersion = identifier(vocabularyVersion, "visual_vocabulary_version");
  }

  resolveTarget(userId, image, requestedTarget) {
    if (requestedTarget != null) return token(requestedTarget, "requested_target");
    if (!image.case_id) fail("requested_target is required when no active Case visual request exists");
    const active = this.visualEvidence.nextRequest(userId, { field_id:image.field_id, crop_season_id:image.crop_season_id, case_id:image.case_id });
    if (active.request_type !== "PHOTO" || !active.target) fail("no active visual target exists for this image");
    return token(active.target, "requested_target");
  }

  async minimumContext(image, requestedTarget) {
    if (this.contextResolver) return this.contextResolver(structuredClone(image), requestedTarget);
    const season = this.db.prepare("SELECT crop FROM crop_seasons WHERE owner_user_id=? AND field_id=? AND season_id=?").get(image.user_id, image.field_id, image.crop_season_id);
    return {
      crop: season?.crop ?? "UNKNOWN",
      requested_plant_part: image.plant_part_scope,
      captured_view: image.view_type,
      capture_intent: image.capture_intent,
      comparison_role: image.comparison_role,
      comparison_role_source: image.comparison_role_source,
      spatial_scope: image.spatial_scope,
      requested_target: requestedTarget,
    };
  }

  deriveOutcome(userId, image, result) {
    const target = result.observability.find((entry) => entry.concept === result.requested_target);
    if (["ASSESSABLE", "PARTIALLY_ASSESSABLE"].includes(target.state)) return { perception_outcome:"PERCEPTION_COMPLETE", next_visual_action:{ action:"NONE" } };
    const prior = this.db.prepare("SELECT r.result_json FROM visual_perception_results r JOIN visual_perception_requests q ON q.analysis_request_id=r.analysis_request_id JOIN image_evidence i ON i.image_evidence_id=q.image_evidence_id WHERE q.owner_user_id=? AND i.case_id IS ? AND q.requested_target=? ORDER BY q.queued_at").all(userId, image.case_id, result.requested_target).map((row) => JSON.parse(row.result_json)).filter((entry) => entry.perception_outcome === "BETTER_VIEW_REQUIRED");
    if (prior.length) return { perception_outcome:"TARGET_NOT_VISUALLY_ASSESSABLE", next_visual_action:{ action:"NONE", reason:"One governed better-view request was already issued for this target." } };
    let next;
    try { next = image.case_id ? this.visualEvidence.nextRequest(userId, { field_id:image.field_id, crop_season_id:image.crop_season_id, case_id:image.case_id }) : null; } catch { next = null; }
    if (next?.request_type === "STOP_VISUAL_REQUEST") {
      const map = { FIELD_CHECK_REQUIRED_INSTEAD:"FIELD_CHECK_REQUIRED", COUNT_REQUIRED_INSTEAD:"COUNT_REQUIRED", MEASUREMENT_REQUIRED_INSTEAD:"MEASUREMENT_REQUIRED", EXPERT_REVIEW_REQUIRED:"EXPERT_REVIEW_REQUIRED", LAB_EVIDENCE_REQUIRED:"LAB_EVIDENCE_REQUIRED" };
      const outcome = map[next.stop_condition];
      if (outcome) return { perception_outcome:outcome, next_visual_action:{ action:"NONE", stop_condition:next.stop_condition } };
    }
    return { perception_outcome:"BETTER_VIEW_REQUIRED", next_visual_action:{ action:"BETTER_VIEW_REQUIRED", target:result.requested_target, view_type:next?.view_type ?? image.view_type, one_primary_request:true, photo_checklist:false } };
  }

  async request(userId, input) {
    identifier(userId, "user_id"); object(input, "visual perception request"); exactKeys(input, ["image_evidence_id", "requested_target", "provider_id", "manual_proposal"], "visual perception request");
    const image = this.visualEvidence.get(userId, identifier(input.image_evidence_id, "image_evidence_id"));
    const requestedTarget = this.resolveTarget(userId, image, input.requested_target);
    const providerManifest = this.provider.getManifest();
    if (input.provider_id != null && input.provider_id !== providerManifest.provider_id) fail("requested provider does not match configured provider");
    if (input.manual_proposal != null && providerManifest.provider_type !== "MANUAL_STRUCTURED_PROVIDER") fail("manual_proposal is allowed only for the configured manual structured provider");
    const authoritativeContext = await this.minimumContext(image, requestedTarget);
    if (!authoritativeContext || typeof authoritativeContext !== "object" || Array.isArray(authoritativeContext)) fail("minimum context resolver returned invalid context");
    assertMinimumNecessaryContext(authoritativeContext);
    const contextHash = hash({ authoritativeContext, manual_proposal_hash:input.manual_proposal == null ? null : hash(input.manual_proposal) });
    const reuseKey = hash({ image_hash:image.content_hash, provider_id:providerManifest.provider_id, provider_version:providerManifest.provider_version, requested_target:requestedTarget, context_hash:contextHash, vocabulary_version:this.vocabularyVersion });
    const existing = this.db.prepare("SELECT q.*,r.result_json FROM visual_perception_requests q JOIN visual_perception_results r ON r.analysis_request_id=q.analysis_request_id WHERE q.owner_user_id=? AND q.reuse_key=? AND q.status IN ('COMPLETED','SUPERSEDED') ORDER BY q.completed_at DESC LIMIT 1").get(userId, reuseKey);
    if (existing) return { status:"COMPLETED", reused:true, request:safeRequestRecord(existing), result:JSON.parse(existing.result_json) };
    const now = this.clock().toISOString(), requestId = `visual-perception-request-${this.idProvider()}`;
    const request = {
      analysis_request_id: requestId,
      image_evidence_id: image.image_evidence_id,
      provider_id: providerManifest.provider_id,
      provider_version: providerManifest.provider_version,
      provider_type: providerManifest.provider_type,
      request_version: VISUAL_PERCEPTION_REQUEST_VERSION,
      runtime_version: VISUAL_PERCEPTION_RUNTIME_VERSION,
      requested_target: requestedTarget,
      context_hash: contextHash,
      vocabulary_version: this.vocabularyVersion,
      invocation_reason: "EXPLICIT_GOVERNED_REQUEST",
      minimum_necessary_context: authoritativeContext,
      candidate_blind: true,
      automatic_on_upload: false,
      queued_at: now,
    };
    this.db.prepare("INSERT INTO visual_perception_requests VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(requestId, userId, image.image_evidence_id, providerManifest.provider_id, providerManifest.provider_version, requestedTarget, contextHash, this.vocabularyVersion, reuseKey, "RUNNING", null, null, JSON.stringify(request), now, now, null);
    try {
      let imagePayload = null;
      if (providerManifest.requires_image_data) {
        if (!this.imageLoader) throw new VisualPerceptionError("UNSUPPORTED_MEDIA", "server-side image loader is unavailable");
        const internal = this.db.prepare("SELECT storage_key FROM image_evidence WHERE image_evidence_id=? AND owner_user_id=?").get(image.image_evidence_id, userId);
        const bytes = await this.imageLoader(internal.storage_key, image.media);
        imagePayload = { bytes, media_type:image.media.media_type, size_bytes:image.media.size_bytes };
      }
      const raw = await this.provider.analyzeImage({ imageEvidence:{ image_evidence_id:image.image_evidence_id, content_hash:image.content_hash, media:image.media }, requestedVisualTarget:requestedTarget, authoritativeContext, allowedVisualVocabulary:[...FEATURES], visualVocabularyVersion:this.vocabularyVersion, imagePayload, manualProposal:input.manual_proposal == null ? null : structuredClone(input.manual_proposal) });
      const completedAt = this.clock().toISOString();
      const validated = validateProviderOutput(raw, { image, request, providerManifest, now:completedAt });
      const result = { ...validated, ...this.deriveOutcome(userId, image, validated), perception_result_id:`visual-perception-result-${this.idProvider()}`, result_version:VISUAL_PERCEPTION_RESULT_VERSION, visual_vocabulary_version:this.vocabularyVersion, accepted_at:completedAt };
      const resultHash = hash(result);
      this.db.exec("BEGIN IMMEDIATE");
      try {
        this.db.prepare("UPDATE visual_perception_requests SET status='SUPERSEDED' WHERE owner_user_id=? AND image_evidence_id=? AND requested_target=? AND status='COMPLETED'").run(userId, image.image_evidence_id, requestedTarget);
        this.visualEvidence.addAssessment(userId, image.image_evidence_id, toB1Assessment(result, providerManifest.provider_type), providerManifest);
        this.db.prepare("INSERT INTO visual_perception_results VALUES(?,?,?,?,?,?,?)").run(result.perception_result_id, requestId, userId, image.image_evidence_id, resultHash, JSON.stringify({ ...result, result_hash:resultHash }), completedAt);
        this.db.prepare("UPDATE visual_perception_requests SET status='COMPLETED',result_id=?,completed_at=? WHERE analysis_request_id=?").run(result.perception_result_id, completedAt, requestId);
        this.db.exec("COMMIT");
      } catch (error) { this.db.exec("ROLLBACK"); throw error; }
      return { status:"COMPLETED", reused:false, request:{ ...request, status:"COMPLETED", result_id:result.perception_result_id, started_at:now, completed_at:completedAt }, result:{ ...result, result_hash:resultHash } };
    } catch (error) {
      const category = error instanceof VisualPerceptionError ? error.category : error instanceof InvestigationContractError ? "SCHEMA_VALIDATION_FAILED" : "UNKNOWN_PROVIDER_ERROR";
      const completedAt = this.clock().toISOString(), state = REJECTION_CATEGORIES.has(category) ? "REJECTED" : "FAILED";
      this.db.prepare("UPDATE visual_perception_requests SET status=?,failure_category=?,completed_at=? WHERE analysis_request_id=?").run(state, category, completedAt, requestId);
      const failedRow = this.db.prepare("SELECT * FROM visual_perception_requests WHERE analysis_request_id=?").get(requestId);
      return { status:state, reused:false, perception_outcome:"PERCEPTION_UNAVAILABLE", error_category:category, request:safeRequestRecord(failedRow), result:null };
    }
  }

  get(userId, analysisRequestId) {
    const row = this.db.prepare("SELECT q.*,r.result_json FROM visual_perception_requests q LEFT JOIN visual_perception_results r ON r.analysis_request_id=q.analysis_request_id WHERE q.analysis_request_id=? AND q.owner_user_id=?").get(identifier(analysisRequestId, "analysis_request_id"), userId);
    if (!row) fail("visual perception request scope not found", "AUTHORIZATION_ERROR");
    return { request:safeRequestRecord(row), result:row.result_json ? JSON.parse(row.result_json) : null };
  }

  history(userId, imageEvidenceId) {
    this.visualEvidence.get(userId, identifier(imageEvidenceId, "image_evidence_id"));
    const rows = this.db.prepare("SELECT q.*,r.result_json FROM visual_perception_requests q LEFT JOIN visual_perception_results r ON r.analysis_request_id=q.analysis_request_id WHERE q.owner_user_id=? AND q.image_evidence_id=? ORDER BY q.queued_at,q.analysis_request_id").all(userId, imageEvidenceId);
    return { authority:"SERVER_VISUAL_PERCEPTION_AUDIT", image_evidence_id:imageEvidenceId, history:rows.map((row) => ({ request:safeRequestRecord(row), result:row.result_json ? JSON.parse(row.result_json) : null })) };
  }

  health(userId) {
    const manifest = this.provider.getManifest(), last = this.db.prepare("SELECT status,failure_category,completed_at FROM visual_perception_requests WHERE owner_user_id=? ORDER BY queued_at DESC,analysis_request_id DESC LIMIT 1").get(userId), counts = this.db.prepare("SELECT status,COUNT(*) count FROM visual_perception_requests WHERE owner_user_id=? GROUP BY status").all(userId);
    return { authority:"SERVER_VISUAL_PERCEPTION_DIAGNOSTICS", runtime_version:VISUAL_PERCEPTION_RUNTIME_VERSION, visual_vocabulary_version:this.vocabularyVersion, provider:manifest, last_invocation:last ?? null, request_counts:Object.fromEntries(counts.map((row) => [row.status,row.count])), api_key_exposed:false };
  }
}

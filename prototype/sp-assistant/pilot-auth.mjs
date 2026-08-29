import { createHash, timingSafeEqual } from "node:crypto";

const IDENTIFIER = /^[A-Za-z0-9._:-]{1,160}$/;

function invalid(message) {
  throw Object.assign(new Error(message), { code:"CONFIGURATION_ERROR", status:503 });
}

function safeIdentifier(value, name) {
  if (typeof value !== "string" || !IDENTIFIER.test(value)) invalid(`invalid pilot ${name}`);
  return value;
}

function credentialDigest(value) {
  return createHash("sha256").update(String(value ?? ""), "utf8").digest();
}

function sameCredential(actual, expected) {
  return timingSafeEqual(credentialDigest(actual), credentialDigest(expected));
}

function publicIdentity(record) {
  return {
    user_id:record.user_id,
    login_id:record.login_id,
    display_name:record.display_name,
    role:record.role,
  };
}

export function createPilotCredentialRegistry({ users, defaultPassword, defaultUserId = "prototype-spa-001", defaultLoginId = "pilot" } = {}) {
  const configured = users ?? [{ login_id:defaultLoginId, user_id:defaultUserId, password:defaultPassword, enabled:true, display_name:"ผู้ใช้งานทดสอบ", role:"SPA" }];
  if (!Array.isArray(configured) || configured.length < 1 || configured.length > 100) invalid("pilot credential registry must contain 1-100 users");
  const loginIds = new Set(), userIds = new Set();
  const records = configured.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) invalid("invalid pilot credential record");
    const allowed = new Set(["login_id","user_id","password","enabled","display_name","role"]);
    if (Object.keys(entry).some((key) => !allowed.has(key))) invalid("unsupported pilot credential field");
    const login_id = safeIdentifier(entry.login_id, "login_id"), user_id = safeIdentifier(entry.user_id, "user_id");
    if (loginIds.has(login_id) || userIds.has(user_id)) invalid("duplicate pilot credential identity");
    loginIds.add(login_id); userIds.add(user_id);
    if (typeof entry.password !== "string" || !entry.password || entry.password.length > 1_024) invalid("invalid pilot credential");
    return Object.freeze({
      login_id,
      user_id,
      password:entry.password,
      enabled:entry.enabled !== false,
      display_name:typeof entry.display_name === "string" && entry.display_name.trim() ? entry.display_name.trim().slice(0,160) : login_id,
      role:typeof entry.role === "string" && IDENTIFIER.test(entry.role) ? entry.role : "PILOT_USER",
    });
  });
  const enabled = records.filter((record) => record.enabled);

  return Object.freeze({
    authenticate(payload) {
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
      if (Object.keys(payload).some((key) => !["login_id","password"].includes(key))) return null;
      if (typeof payload.password !== "string") return null;
      const loginId = payload.login_id == null && enabled.length === 1 ? enabled[0].login_id : payload.login_id;
      const selected = records.find((record) => record.login_id === loginId);
      const expected = selected?.password ?? "disabled-or-unknown-pilot-credential";
      const valid = sameCredential(payload.password, expected);
      if (!selected || !selected.enabled || !valid) return null;
      return publicIdentity(selected);
    },
    publicIdentities:records.map(publicIdentity),
  });
}

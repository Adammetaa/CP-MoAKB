import { createStableId } from "./field-core.js?v=fixed-login-1";

export const DEFAULT_PROTOTYPE_USER = Object.freeze({
  user_id: "prototype-spa-001",
  username: "SPA1",
  display_name: "ผู้ใช้งานทดสอบ",
  role: "SPA",
});

export function resolvePrototypeAccess(password, now = new Date(), cryptoProvider = globalThis.crypto) {
  const submittedPassword = String(password ?? "");
  if (!submittedPassword) throw new Error("กรุณากรอกรหัสผ่าน");
  if (submittedPassword !== "1234") throw new Error("รหัสผ่านไม่ถูกต้อง");
  return {
    ...DEFAULT_PROTOTYPE_USER,
    session: {
      session_id: createStableId("session", cryptoProvider),
      issued_at: now.toISOString(),
      authentication_mode: "PROTOTYPE_INTERNAL_ACCESS",
    },
  };
}

export function loginToPrototypeWorkspace(repository, password, now = new Date(), cryptoProvider = globalThis.crypto) {
  const user = resolvePrototypeAccess(password, now, cryptoProvider);
  const state = repository.load();
  state.users = state.users.filter((item) => item.user_id !== user.user_id);
  state.users.push(user);
  state.active_user_id = user.user_id;
  repository.save(state);
  return { user, nextRoute: "gps" };
}

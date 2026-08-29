import { createStableId } from "./field-core.js?v=fixed-login-1";

export function resolvePrototypeAccess(identity, now = new Date(), cryptoProvider = globalThis.crypto) {
  if (!identity || typeof identity !== "object" || !/^[A-Za-z0-9._:-]{1,160}$/.test(identity.user_id ?? "")) throw new Error("ไม่สามารถยืนยันตัวตนจาก server");
  return {
    user_id:identity.user_id,
    username:identity.login_id ?? identity.user_id,
    display_name:identity.display_name ?? identity.login_id ?? identity.user_id,
    role:identity.role ?? "PILOT_USER",
    session: {
      session_id: createStableId("session", cryptoProvider),
      issued_at: now.toISOString(),
      authentication_mode: "PROTOTYPE_INTERNAL_ACCESS",
    },
  };
}

export function loginToPrototypeWorkspace(repository, identity, now = new Date(), cryptoProvider = globalThis.crypto) {
  const user = resolvePrototypeAccess(identity, now, cryptoProvider);
  const state = repository.load();
  state.users = state.users.filter((item) => item.user_id !== user.user_id);
  state.users.push(user);
  state.active_user_id = user.user_id;
  repository.save(state);
  return { user, nextRoute: "gps" };
}

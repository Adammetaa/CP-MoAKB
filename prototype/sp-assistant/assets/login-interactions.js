export function togglePasswordVisibility(root, button) {
  const password = root.querySelector("#password");
  if (!password || !button) return false;

  const selectionStart = password.selectionStart;
  const selectionEnd = password.selectionEnd;
  const reveal = password.type === "password";

  password.type = reveal ? "text" : "password";
  button.setAttribute("aria-pressed", String(reveal));
  button.setAttribute("aria-label", reveal ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน");
  password.focus({ preventScroll: true });
  if (selectionStart !== null && selectionEnd !== null) password.setSelectionRange(selectionStart, selectionEnd);
  return true;
}

export function handleLoginInteraction(event, root) {
  const button = event.target.closest?.('[data-action="toggle-password"]');
  if (!button || !root.contains(button)) return false;
  event.preventDefault();
  event.stopPropagation();
  return togglePasswordVisibility(root, button);
}

export function captureLoginIdentity(root) {
  const username = root.querySelector("#username");
  const password = root.querySelector("#password");
  return {
    username,
    password,
    usernameValue: username?.value ?? "",
    passwordValue: password?.value ?? "",
  };
}

export function assertLoginIdentity(root, snapshot, consoleApi = console) {
  const usernameStable = snapshot.username === root.querySelector("#username");
  const passwordStable = snapshot.password === root.querySelector("#password");
  const usernameValueStable = snapshot.usernameValue === root.querySelector("#username")?.value;
  const passwordValueStable = snapshot.passwordValue === root.querySelector("#password")?.value;
  consoleApi.assert(usernameStable, "SP Assistant: username DOM node was replaced during password toggle");
  consoleApi.assert(passwordStable, "SP Assistant: password DOM node was replaced during password toggle");
  consoleApi.assert(usernameValueStable, "SP Assistant: username value changed during password toggle");
  consoleApi.assert(passwordValueStable, "SP Assistant: password value changed during password toggle");
  return usernameStable && passwordStable && usernameValueStable && passwordValueStable;
}

export function readLoginCredentials(form) {
  return {
    username: form.elements.namedItem("username")?.value ?? "",
    password: form.elements.namedItem("password")?.value ?? "",
  };
}

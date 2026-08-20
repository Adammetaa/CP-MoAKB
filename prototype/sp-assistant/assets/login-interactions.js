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

export function readLoginCredentials(form) {
  return {
    username: form.elements.namedItem("username")?.value ?? "",
    password: form.elements.namedItem("password")?.value ?? "",
  };
}

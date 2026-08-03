const supportedLanguages = new Set(["th", "en"]);
const languageKey = "cp-moakb-lab-language";

const resolveKey = (catalog, key) =>
  key.split(".").reduce((value, part) => value?.[part], catalog);

const readPreference = () => {
  try {
    const value = window.localStorage.getItem(languageKey);
    return supportedLanguages.has(value) ? value : "th";
  } catch {
    return "th";
  }
};

const writePreference = (language) => {
  try {
    window.localStorage.setItem(languageKey, language);
  } catch {
    // The static Thai fallback remains complete when storage is unavailable.
  }
};

let catalogs = {};
let language = readPreference();

const loadCatalogs = async () => {
  const [thai, english] = await Promise.all([
    fetch("assets/i18n/th.json").then((response) => response.json()),
    fetch("assets/i18n/en.json").then((response) => response.json()),
  ]);
  catalogs = { th: thai, en: english };
};

const applyLanguage = (nextLanguage) => {
  if (!supportedLanguages.has(nextLanguage) || !catalogs[nextLanguage]) return;
  language = nextLanguage;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const translated = resolveKey(catalogs[language], element.dataset.i18n);
    if (typeof translated === "string") element.textContent = translated;
  });
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
  writePreference(language);
};

const bindLanguage = () => {
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });
};

const bindMenu = () => {
  const button = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-primary-nav]");
  button?.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    navigation?.classList.toggle("is-open", !open);
  });
};

const bindRoleSwitcher = () => {
  const switcher = document.querySelector("[data-role-switcher]");
  const output = document.querySelector("[data-role-output]");
  switcher?.addEventListener("change", () => {
    const role = switcher.value;
    document.querySelectorAll("[data-roles]").forEach((item) => {
      const roles = item.dataset.roles.split(",");
      item.hidden = !roles.includes("all") && !roles.includes(role);
    });
    if (output) {
      output.textContent = `Mock role view: ${role}. This does not implement permissions.`;
    }
  });
};

const bindConceptualActions = () => {
  const status = document.querySelector("[data-action-status]");
  document.querySelectorAll("[data-conceptual-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (status) {
        status.textContent =
          language === "th"
            ? "สาธิตเท่านั้น: ไม่มีการเปลี่ยนสถานะหรือบันทึกข้อมูล"
            : "Demonstration only: no state was changed or persisted.";
      }
    });
  });
};

const start = async () => {
  bindMenu();
  bindRoleSwitcher();
  bindConceptualActions();
  try {
    await loadCatalogs();
    bindLanguage();
    applyLanguage(language);
  } catch {
    // Direct file reading and no-JavaScript use retain the Thai-first HTML.
  }
};

start();

export { applyLanguage, readPreference, resolveKey };

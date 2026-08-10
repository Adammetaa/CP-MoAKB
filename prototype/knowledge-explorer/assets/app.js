const storageKey = "cp-moakb-explorer-language";
const supportedLanguages = new Set(["th", "en"]);
const page = typeof document === "undefined" ? "home" : document.body.dataset.page || "home";
let messages = {};
let knowledgeData = null;
let governedBatchData = null;
let activeFilter = "all";

const readLanguagePreference = (storage) => {
  try {
    const storedLanguage = storage?.getItem(storageKey);
    return supportedLanguages.has(storedLanguage) ? storedLanguage : "th";
  } catch {
    return "th";
  }
};

const writeLanguagePreference = (storage, nextLanguage) => {
  if (!supportedLanguages.has(nextLanguage)) return false;
  try {
    storage?.setItem(storageKey, nextLanguage);
    return Boolean(storage);
  } catch {
    return false;
  }
};

let language = readLanguagePreference(typeof window === "undefined" ? null : window.localStorage);

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const resolveKey = (object, key) => key.split(".").reduce((value, part) => value?.[part], object);

const translateCatalog = (catalogs, locale, key, replacements = {}) => {
  const value = resolveKey(catalogs[locale], key);
  if (typeof value !== "string") throw new Error(`Missing ${locale} translation key: ${key}`);
  return Object.entries(replacements).reduce(
    (text, [name, replacement]) => text.replaceAll(`{${name}}`, String(replacement)),
    value,
  );
};

const t = (key, replacements = {}) => {
  return translateCatalog(messages, language, key, replacements);
};

const languageToggleState = (locale) => ({
  th: locale === "th",
  en: locale === "en",
});

const applyDocumentLanguage = (documentElement, locale) => {
  documentElement.lang = supportedLanguages.has(locale) ? locale : "th";
};

const localized = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value[language] ?? value.en ?? "";
  return value ?? "";
};

const applyTranslations = () => {
  applyDocumentLanguage(document.documentElement, language);
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  document.title = t(`meta.${page}.title`);
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", t(`meta.${page}.description`));
};

const navItems = [
  ["home", "nav.home", "index.html"],
  ["search", "nav.search", "search.html"],
  ["browse", "nav.browse", "browse.html"],
  ["governance", "nav.governance", "governance.html"],
  ["about", "nav.about", "about.html"],
];

const renderHeader = () => {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;
  header.innerHTML = `
    <a class="brand" href="index.html" aria-label="${escapeHtml(t("nav.brandLabel"))}">
      <span class="brand-mark" aria-hidden="true">CP</span>
      <span><strong>CP-MoAKB</strong><small>Knowledge Explorer</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${escapeHtml(t("nav.menu"))}</button>
    <nav id="site-nav" class="site-nav" aria-label="${escapeHtml(t("nav.primaryLabel"))}">
      ${navItems.map(([key, label, href]) => `<a href="${href}" ${page === key ? 'aria-current="page"' : ""}>${escapeHtml(t(label))}</a>`).join("")}
    </nav>
    <div class="language-switcher" role="group" aria-label="${escapeHtml(t("language.label"))}">
      <button type="button" data-language="th" lang="th" aria-pressed="${language === "th"}" aria-label="${escapeHtml(t("language.thai"))}">ไทย</button>
      <span aria-hidden="true">|</span>
      <button type="button" data-language="en" lang="en" aria-pressed="${language === "en"}" aria-label="${escapeHtml(t("language.english"))}">EN</button>
    </div>
    <a class="header-cta" href="search.html">${escapeHtml(t("nav.explore"))}</a>`;

  const menuToggle = header.querySelector(".menu-toggle");
  const nav = header.querySelector(".site-nav");
  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    nav?.classList.toggle("is-open", !open);
  });
  header.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
};

const renderFooter = () => {
  const footer = document.querySelector("[data-site-footer]");
  if (!footer) return;
  footer.innerHTML = `
    <div><strong>CP-MoAKB Knowledge Explorer</strong><p>${escapeHtml(t("prototype.footer"))}</p></div>
    <div><div class="footer-links"><a href="governance.html">${escapeHtml(t("nav.governance"))}</a><a href="components.html">${escapeHtml(t("components.eyebrow"))}</a><a href="about.html">${escapeHtml(t("nav.about"))}</a></div><small data-deployment>${escapeHtml(t("prototype.deploymentUnavailable"))}</small></div>`;
};

const setLanguage = (nextLanguage) => {
  if (!supportedLanguages.has(nextLanguage) || nextLanguage === language) return;
  language = nextLanguage;
  writeLanguagePreference(window.localStorage, language);
  renderPage();
  document.dispatchEvent(new CustomEvent("explorer:language", { detail: { language } }));
};

const loadDeployment = async () => {
  try {
    const response = await fetch("deployment.json");
    if (!response.ok) return;
    const metadata = await response.json();
    if (metadata.deployment_mode !== "preview" || metadata.status !== "fictional-placeholder") return;
    const target = document.querySelector("[data-deployment]");
    if (target) target.textContent = t("prototype.deployment", {
      commit: String(metadata.commit).slice(0, 12),
      timestamp: metadata.build_timestamp,
      version: metadata.package_version,
    });
  } catch {
    // Deployment metadata exists only in the validated Pages artifact.
  }
};

const conceptCard = (concept) => `
  <article class="card concept-card">
    <div class="card-meta"><span class="tag tag-placeholder">${escapeHtml(t("data.placeholder"))}</span><span>${escapeHtml(localized(concept.type))}</span></div>
    <h3><a href="concept.html">${escapeHtml(localized(concept.title))}</a></h3>
    <p>${escapeHtml(localized(concept.definition))}</p>
    <div class="card-footer"><span class="lifecycle-dot"></span>${escapeHtml(localized(concept.lifecycle))}<a href="concept.html">${escapeHtml(t("data.viewConcept"))} <span aria-hidden="true">→</span></a></div>
  </article>`;

const renderHome = () => {
  if (!knowledgeData) return;
  const stats = document.querySelector("[data-stats]");
  if (stats) {
    stats.setAttribute("aria-label", t("data.statisticsLabel"));
    stats.innerHTML = knowledgeData.statistics.map((item) => `<div class="stat"><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(localized(item.label))}</span></div>`).join("");
  }
  const latest = document.querySelector("[data-latest-concepts]");
  if (latest) latest.innerHTML = knowledgeData.concepts.slice(0, 3).map(conceptCard).join("");
  const sources = document.querySelector("[data-latest-sources]");
  if (sources) sources.innerHTML = knowledgeData.sources.map((source) => `<a class="source-row" href="source.html"><span class="source-icon">S</span><span><strong>${escapeHtml(localized(source.title))}</strong><small>${escapeHtml(localized(source.authority))}</small></span><span aria-hidden="true">→</span></a>`).join("");
};

const searchableText = (item) => JSON.stringify(item).toLocaleLowerCase();

const searchKnowledge = (data, query = "", filter = "all") => {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  return [
    ...data.concepts.map((item) => ({ ...item, resultType: "concept", href: "concept.html" })),
    ...data.evidence.map((item) => ({ ...item, resultType: "evidence", href: "evidence.html", definition: item.limitations, lifecycle: item.status })),
    ...data.sources.map((item) => ({ ...item, resultType: "source", href: "source.html", definition: item.scope, lifecycle: item.status })),
  ].filter((item) => (filter === "all" || item.resultType === filter) && (!normalizedQuery || searchableText(item).includes(normalizedQuery)));
};

const localizedResultCount = (catalogs, locale, count) => (
  count === 1
    ? translateCatalog(catalogs, locale, "search.countOne")
    : translateCatalog(catalogs, locale, "search.count", { count })
);

const renderSearch = () => {
  if (!knowledgeData) return;
  const input = document.querySelector("[data-search-input]");
  const query = input?.value ?? "";
  const items = searchKnowledge(knowledgeData, query, activeFilter);
  const count = document.querySelector("[data-result-count]");
  if (count) count.textContent = localizedResultCount(messages, language, items.length);
  const results = document.querySelector("[data-results]");
  if (!results) return;
  if (!items.length) {
    results.innerHTML = `<div class="empty-state" role="status">${escapeHtml(t("search.empty"))}</div>`;
    return;
  }
  results.innerHTML = items.map((item) => `<article class="result-card"><span class="tag tag-${item.resultType}">${escapeHtml(t(`data.${item.resultType}`))}</span><div><h3><a href="${item.href}">${escapeHtml(localized(item.title))}</a></h3><p>${escapeHtml(localized(item.definition))}</p><small>${escapeHtml(localized(item.lifecycle))}</small></div><span class="result-arrow" aria-hidden="true">→</span></article>`).join("");
};

const renderConcept = () => {
  if (!knowledgeData) return;
  const concept = knowledgeData.concepts[0];
  document.querySelectorAll("[data-concept-title]").forEach((element) => { element.textContent = localized(concept.title); });
  const definition = document.querySelector("[data-concept-definition]");
  if (definition) definition.textContent = localized(concept.definition);
  const relationships = document.querySelector("[data-relationships]");
  if (relationships) relationships.innerHTML = concept.relationships.map((item) => `<a class="relationship-chip" href="${item.target.en.includes("Evidence") ? "evidence.html" : item.target.en.includes("Authority") ? "authority.html" : "concept.html"}"><span>${escapeHtml(localized(item.predicate))}</span><strong>${escapeHtml(localized(item.target))}</strong></a>`).join("");
};

const renderDetails = () => {
  if (!knowledgeData) return;
  const evidence = knowledgeData.evidence[0];
  document.querySelectorAll("[data-evidence-title]").forEach((element) => { element.textContent = localized(evidence.title); });
  const source = knowledgeData.sources[0];
  document.querySelectorAll("[data-source-title]").forEach((element) => { element.textContent = localized(source.title); });
  const authority = knowledgeData.authorities[0];
  document.querySelectorAll("[data-authority-title]").forEach((element) => { element.textContent = localized(authority.name); });
};

const renderGovernedBatch = () => {
  if (!governedBatchData || page !== "realKnowledge") return;
  document.querySelectorAll("[data-governed-package]").forEach((element) => { element.textContent = governedBatchData.package.id; });
  document.querySelectorAll("[data-governed-view]").forEach((element) => { element.textContent = governedBatchData.view.id; });
  document.querySelectorAll("[data-governed-summary]").forEach((element) => { element.textContent = governedBatchData.summary; });
  document.querySelectorAll("[data-governed-count]").forEach((element) => {
    const count = governedBatchData.counts[element.dataset.governedCount];
    if (Number.isInteger(count)) element.textContent = String(count);
  });
};

const renderPage = () => {
  applyTranslations();
  renderHeader();
  renderFooter();
  renderHome();
  renderSearch();
  renderConcept();
  renderDetails();
  renderGovernedBatch();
  loadDeployment();
};

const bindInteractions = () => {
  document.querySelectorAll("[data-search-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (page === "search") renderSearch();
      else {
        const query = new FormData(form).get("q")?.toString().trim() ?? "";
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
      }
    });
  });
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      renderSearch();
    });
  });
  document.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const group = tab.closest("[data-tabs]");
      group?.querySelectorAll("[data-tab]").forEach((item) => item.setAttribute("aria-selected", String(item === tab)));
      document.getElementById(tab.getAttribute("aria-controls"))?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};

const initialize = async () => {
  const [thaiResponse, englishResponse, dataResponse, governedResponse] = await Promise.all([
    fetch("assets/i18n/th.json"),
    fetch("assets/i18n/en.json"),
    fetch("assets/data/mock-knowledge.json"),
    fetch("assets/data/governed-batch-001.json"),
  ]);
  if (!thaiResponse.ok || !englishResponse.ok) throw new Error("Localization dictionaries unavailable");
  messages = { th: await thaiResponse.json(), en: await englishResponse.json() };
  if (dataResponse.ok) knowledgeData = await dataResponse.json();
  if (governedResponse.ok) governedBatchData = await governedResponse.json();
  const params = new URLSearchParams(window.location.search);
  const searchInput = document.querySelector("[data-search-input]");
  if (searchInput) searchInput.value = params.get("q") ?? "";
  bindInteractions();
  renderPage();
};

globalThis.__explorerLocalization = Object.freeze({
  applyDocumentLanguage,
  languageToggleState,
  localizedResultCount,
  readLanguagePreference,
  searchKnowledge,
  storageKey,
  translateCatalog,
  writeLanguagePreference,
});

if (typeof document !== "undefined" && !globalThis.__EXPLORER_TEST__) {
  initialize().catch(() => {
    applyDocumentLanguage(document.documentElement, "th");
    document.querySelectorAll("[data-live-region]").forEach((region) => {
      region.textContent = "ต้องเปิดผ่านเซิร์ฟเวอร์สถิติเพื่อโหลดข้อมูลสมมติ";
    });
  });
}

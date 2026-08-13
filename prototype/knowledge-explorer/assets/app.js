const storageKey = "cp-moakb-explorer-language";
const supportedLanguages = new Set(["th", "en"]);
const page = typeof document === "undefined" ? "home" : document.body.dataset.page || "home";
let messages = {};
let knowledgeData = null;
let governedBatchData = null;
let integratedKnowledgeData = null;
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

const integrationStates = new Set(["SUPPORTED", "INCOMPLETE", "CONFLICTING", "AUTHORITY_BLOCKED", "NEEDS_REVIEW", "NOT_APPLICABLE"]);

const projectProductComparison = (data, comparisonId) => {
  const comparison = data.product_comparisons?.find((item) => item.id === comparisonId);
  if (!comparison) throw new Error(`Unknown product comparison: ${comparisonId}`);
  const products = new Map(data.entities.products.map((item) => [item.id, item]));
  const chemicals = new Map(data.entities.chemicals.map((item) => [item.id, item]));
  const manufacturers = new Map(data.entities.manufacturers.map((item) => [item.id, item]));
  const registrations = new Map(data.entities.registrations.map((item) => [item.product_id, item]));
  const regulatoryCandidates = new Map(data.regulatory_positive_search.candidates.map((item) => [item.id, item]));
  const sources = new Map(data.sources.map((item) => [item.id, item]));
  const candidates = comparison.candidates.map((candidate) => {
    const product = products.get(candidate.product_id);
    const regulatoryCandidate = regulatoryCandidates.get(candidate.regulatory_candidate_id);
    if (!product || !regulatoryCandidate) throw new Error(`Invalid comparison candidate: ${candidate.id}`);
    const registration = registrations.get(product.id);
    const activeIngredient = chemicals.get(product.active_ingredient_id);
    const manufacturer = manufacturers.get(product.manufacturer_id);
    if (!registration || !activeIngredient || !manufacturer) throw new Error(`Incomplete comparison identity: ${candidate.id}`);
    const sourceIds = [...new Set([product.source_identity, candidate.moa.source_id, ...candidate.official_source_ids].filter(Boolean))];
    return { ...candidate, product, registration, activeIngredient, manufacturer, regulatoryCandidate, provenance: sourceIds.map((id) => sources.get(id)).filter(Boolean) };
  }).sort((left, right) => left.neutral_sort_key.localeCompare(right.neutral_sort_key, "en"));
  if (candidates.map((item) => item.id).join("|") !== comparison.candidate_ids.join("|")) throw new Error(`Non-deterministic comparison order: ${comparisonId}`);
  return { ...comparison, candidates, recommendation: null, ranking: null, score: null, treatmentSelection: null };
};

const projectIntegratedKnowledge = (data, viewId) => {
  const view = data.views.find((item) => item.id === viewId);
  if (!view) throw new Error(`Unknown integrated Knowledge View: ${viewId}`);
  const sources = new Map(data.sources.map((source) => [source.id, source]));
  const assertions = new Map(data.assertions.map((assertion) => [assertion.id, assertion]));
  const relationships = new Map(data.relationships.map((relationship) => [relationship.id, relationship]));
  const resolveAssertions = (ids) => ids.map((id) => {
    const assertion = assertions.get(id);
    if (!assertion || !integrationStates.has(assertion.state)) throw new Error(`Invalid integrated assertion: ${id}`);
    const source = sources.get(assertion.source_id);
    if (!source) throw new Error(`Assertion ${id} has no provenance source`);
    return { ...assertion, provenance: { sourceId: source.id, sourceClass: source.class, title: source.title, versionDate: source.version_date, retrievedAt: source.retrieved_at, locator: source.locator, limitations: source.limitations } };
  });
  const projectedRelationships = view.relationship_ids.map((id) => {
    const relationship = relationships.get(id);
    if (!relationship || !integrationStates.has(relationship.state) || !relationship.source_assertions.length) throw new Error(`Invalid integrated relationship: ${id}`);
    return { ...relationship, provenance: relationship.source_assertions.map((assertionId) => resolveAssertions([assertionId])[0].provenance) };
  });
  return {
    id: view.id, title: view.title, subjectId: view.subject_id,
    observedInCase: resolveAssertions(view.case_assertions),
    generalKnowledge: resolveAssertions(view.scientific_assertions),
    moaKnowledge: resolveAssertions(view.moa_assertions),
    regulatoryKnowledge: resolveAssertions(view.regulatory_assertions),
    manufacturerKnowledge: resolveAssertions(view.manufacturer_assertions),
    products: data.entities.products.filter((product) => projectedRelationships.some((relationship) => relationship.from === product.id || relationship.to === product.id)),
    relationships: projectedRelationships,
    gapsAndConflicts: projectedRelationships.filter((relationship) => relationship.state !== "SUPPORTED"),
    managementOptionLink: view.management_option_link,
    managementReview: view.management_review || null,
    regulatoryBinding: view.regulatory_binding || null,
    regulatoryPositiveSearch: view.regulatory_positive_search_id === data.regulatory_positive_search?.id ? data.regulatory_positive_search : null,
    productComparison: view.product_comparison_id ? projectProductComparison(data, view.product_comparison_id) : null,
    humanReviewRequired: projectedRelationships.some((relationship) => ["INCOMPLETE", "CONFLICTING", "AUTHORITY_BLOCKED", "NEEDS_REVIEW"].includes(relationship.state)),
    recommendation: null, ranking: null, prescription: null, execution: null, canonicalPromotion: false,
  };
};

const renderProductComparison = (comparison, locale) => {
  const labels = locale === "th" ? {
    context: "บริบท", why: "เหตุผลที่แสดง", identity: "อัตลักษณ์ผลิตภัณฑ์", authority: "สถานะอำนาจ", sources: "แหล่งข้อมูลแยกตามบทบาท", gaps: "ข้อมูลที่ยังขาด", history: "การใช้ก่อนหน้า / ประวัติเคส", important: "สำคัญ",
  } : {
    context: "Context", why: "Why is this product shown?", identity: "Product Identity", authority: "Authority", sources: "Sources by role", gaps: "What is unresolved?", history: "Previous Application / Case History", important: "Important",
  };
  const cards = comparison.candidates.map((candidate) => `<article class="knowledge-card"><p class="eyebrow">${escapeHtml(candidate.target_context)}</p><h3>${escapeHtml(candidate.product.product_name)}</h3><p><strong>${escapeHtml(labels.why)}</strong><br>${escapeHtml(candidate.why_shown)}</p><h4>${escapeHtml(labels.identity)}</h4><ul><li>Manufacturer / registrant: ${escapeHtml(candidate.manufacturer.name)}</li><li>Active ingredient: ${escapeHtml(candidate.activeIngredient.normalized_name)}</li><li>Concentration / formulation: ${escapeHtml(candidate.product.concentration)} Â· ${escapeHtml(candidate.product.formulation)}</li><li>MoA: ${escapeHtml(candidate.moa.system)} ${escapeHtml(candidate.moa.group)} Â· descriptive only</li><li>Registration: ${escapeHtml(candidate.registration.registration_number)} Â· <strong>${escapeHtml(candidate.registration.current_status)}</strong></li></ul><h4>${escapeHtml(labels.authority)}</h4><ul><li>Rice Authority: ${escapeHtml(candidate.authority.crop)}</li><li>Exact Target Authority: ${escapeHtml(candidate.authority.exact_target)}</li><li>Exact CTU: <strong>${escapeHtml(candidate.authority.exact_ctu)}</strong></li></ul><h4>${escapeHtml(labels.sources)}</h4><p>Manufacturer Source: ${escapeHtml(candidate.manufacturer_source.status)}<small>${escapeHtml(candidate.manufacturer_source.limitation)}</small></p><p>Regulatory Authority: ${escapeHtml(candidate.official_source_ids.join("; "))}</p><p>Scientific Source: ${escapeHtml(candidate.scientific_source.scope)}</p>${candidate.source_facts.length ? `<p>${candidate.source_facts.map(escapeHtml).join("; ")}</p>` : ""}<h4>${escapeHtml(labels.gaps)}</h4><ul>${candidate.gaps.map((gap) => `<li>${escapeHtml(gap)}</li>`).join("")}</ul><p><strong>${escapeHtml(labels.history)}:</strong> ${escapeHtml(candidate.previous_case_use.state)} Â· no efficacy or resistance conclusion</p><p>Human Review: ${escapeHtml(candidate.human_review)} Â· cannot upgrade missing authority</p><p><strong>CP-MoAKB does not conclude:</strong> ${escapeHtml(candidate.not_concluded.join("; "))}</p><small>Provenance: ${candidate.provenance.map((source) => `${escapeHtml(source.id)} Â· ${escapeHtml(source.version_date)} Â· ${escapeHtml(source.class)}`).join("; ")}</small></article>`).join("");
  return `<article class="knowledge-card product-comparison" style="grid-column: 1 / -1"><div class="section-heading"><div><p class="eyebrow">${escapeHtml(comparison.id)}</p><h3>${escapeHtml(comparison.title)}</h3><p><strong>${escapeHtml(labels.context)}:</strong> ${escapeHtml(comparison.context.label)}</p><p>${escapeHtml(comparison.context.scope)}</p></div><span class="tag">Neutral alphabetical order</span></div><p>${escapeHtml(comparison.inclusion_rule)}</p><div class="grid-3 corpus-grid">${cards}</div><aside class="boundary-note"><span aria-hidden="true">!</span><div><strong>${escapeHtml(labels.important)}</strong><p>Products are shown for governed knowledge comparison only. Their presence does not constitute a CP-MoAKB recommendation. No score, winner, commercial priority, treatment selection, or automatic Learn promotion is produced. Current registration â‰  exact crop-target-use authority.</p></div></aside></article>`;
};

const renderIntegratedKnowledge = () => {
  const target = document.querySelector("[data-integrated-knowledge]");
  if (!target || !integratedKnowledgeData || page !== "cropProtectionManagement") return;
  const projection = projectIntegratedKnowledge(integratedKnowledgeData, "WV-MSI-BPH-001/v1");
  const labels = language === "th" ? {
    observed: "สิ่งที่สังเกตในเคสนี้", scientific: "องค์ความรู้วิทยาศาสตร์", management: "การทบทวนการจัดการ", moa: "Mode of Action", regulatory: "สถานะทะเบียน", products: "ข้อมูลผลิตภัณฑ์ที่เกี่ยวข้อง", provenance: "แหล่งที่มาและ Provenance", gaps: "ช่องว่าง / ความขัดแย้ง",
  } : {
    observed: "Observed in this Case", scientific: "Scientific Knowledge", management: "Management Review", moa: "Mode of Action", regulatory: "Regulatory Status", products: "Related Product Information", provenance: "Source & Provenance", gaps: "Gaps / Conflicts",
  };
  const formatAssertionDetails = (item) => {
    if (!item.details) return "";
    if (item.source_role === "CASE_EVIDENCE") return `${item.details.observation_timestamp} · ${item.details.burden} ${item.details.unit} · denominator: ${item.details.sampling_denominator} · ${item.details.activity_context} · ${item.details.historical_context} · ${item.details.limitations.join("; ")}`;
    if (item.source_role === "REGULATORY_AUTHORITY") return `registration ${item.details.registration_number} · ${item.details.current_status} · issued ${item.details.issue_date} · expired ${item.details.expiry_date} · status as of ${item.details.status_as_of}`;
    if (item.source_role === "REGULATORY_SUPPORTING_OFFICIAL") return `${item.details.crop} · ${item.details.target} · ${item.details.active_ingredient} ${item.details.concentration} ${item.details.formulation} · rate fact: ${item.details.rate} · not a Case recommendation`;
    return "";
  };
  const assertionList = (title, items) => `<article class="knowledge-card"><h3>${escapeHtml(title)}</h3>${items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item.statement)}${formatAssertionDetails(item) ? `<small>${escapeHtml(formatAssertionDetails(item))}</small>` : ""}<small>${escapeHtml(item.provenance.sourceClass)} · ${escapeHtml(item.provenance.sourceId)} · ${escapeHtml(item.provenance.locator)}</small></li>`).join("")}</ul>` : `<p>${escapeHtml(language === "th" ? "ยังไม่มีความสัมพันธ์ที่ยืนยันแล้ว" : "No established relationship")}</p>`}</article>`;
  const products = projection.products.map((product) => `<li><strong>${escapeHtml(product.product_name)}</strong><small>${escapeHtml(product.concentration)} · ${escapeHtml(product.formulation)} · ${escapeHtml(product.manufacturer_id)} · informational only</small></li>`).join("");
  const gaps = projection.gapsAndConflicts.map((relationship) => `<li><strong>${escapeHtml(relationship.state)}</strong> · ${escapeHtml(relationship.predicate)}<small>${escapeHtml(relationship.limitations.join("; "))}</small></li>`).join("");
  const provenance = [...projection.observedInCase, ...projection.generalKnowledge, ...projection.moaKnowledge, ...projection.regulatoryKnowledge, ...projection.manufacturerKnowledge].map((item) => `<li>${escapeHtml(item.id)} → ${escapeHtml(item.provenance.sourceId)}<small>${escapeHtml(item.provenance.sourceClass)} · ${escapeHtml(item.provenance.versionDate)} · retrieved ${escapeHtml(item.provenance.retrievedAt || "not applicable")}</small></li>`).join("");
  const management = projection.managementReview ? `<article class="knowledge-card"><h3>${escapeHtml(labels.management)}</h3><p><strong>${escapeHtml(projection.managementReview.state)}</strong></p><p>${escapeHtml(`${projection.managementReview.case_count} ${projection.managementReview.unit} · ${projection.managementReview.chemical_information_state}`)}</p><small>${escapeHtml(projection.managementReview.limitation)} · ${escapeHtml(projection.managementReview.threshold_source)}</small></article>` : "";
  const binding = projection.regulatoryBinding;
  const regulatoryBinding = binding ? `<article class="knowledge-card"><h3>${escapeHtml(binding.title)}</h3><p><strong>${escapeHtml(binding.product_identity)}</strong></p><ul><li>Registration: ${escapeHtml(binding.registration_number)}</li><li>Registration Status: <strong>${escapeHtml(binding.registration_status)}</strong> · ${escapeHtml(binding.status_as_of)}</li><li>Crop: ${escapeHtml(binding.crop.label)} · ${escapeHtml(binding.crop.registration_binding)}</li><li>Target: ${escapeHtml(binding.target.label)} · ${escapeHtml(binding.target.registration_binding)}</li><li>Approved Use: <strong>${escapeHtml(binding.approved_use)}</strong></li><li>Stable Identifier: ${escapeHtml(binding.stable_identifier_binding)}</li><li>Rate / Label Fact: ${escapeHtml(binding.rate_fact)}</li></ul><small>Sources: ${escapeHtml(binding.authority_sources.join("; "))}</small><small>Limitations: ${escapeHtml(binding.limitations.join("; "))}</small><p>Human Review: ${escapeHtml(binding.human_review)}</p></article>` : "";
  const positiveSearch = projection.regulatoryPositiveSearch;
  const positiveSearchCard = positiveSearch ? `<article class="knowledge-card"><h3>Current Thai Regulatory Positive-Path Search</h3><p><strong>${escapeHtml(positiveSearch.result)}</strong></p><p>${escapeHtml(positiveSearch.classification)}</p><ul>${positiveSearch.candidates.map((candidate) => `<li><strong>${escapeHtml(candidate.result)}</strong> · ${escapeHtml(candidate.target)}<small>${escapeHtml(candidate.product || "no product identity")} · registration ${escapeHtml(candidate.registration_id || "not established")} · ${escapeHtml(candidate.current_status)} · label ${candidate.official_label_found ? "FOUND" : "NOT FOUND"} · stable ID ${candidate.stable_identifier ? "SUPPORTED" : "BLOCKED"}</small><small>${escapeHtml(candidate.limitation)}</small></li>`).join("")}</ul><p>Qualified current chains: ${escapeHtml(positiveSearch.qualified_positive_slices)}</p><small>${escapeHtml(positiveSearch.next_gap)}</small><p><strong>Current registration identity ≠ approved rice-target-use authority</strong></p></article>` : "";
  target.innerHTML = `<div class="section-heading"><div><p class="eyebrow">${escapeHtml(projection.id)}</p><h2>${escapeHtml(projection.title)}</h2></div><span class="tag tag-real">${escapeHtml(projection.managementOptionLink)}</span></div><div class="grid-3 corpus-grid">${assertionList(labels.observed, projection.observedInCase)}${assertionList(labels.scientific, projection.generalKnowledge)}${management}${assertionList(labels.moa, projection.moaKnowledge)}${assertionList(labels.regulatory, projection.regulatoryKnowledge)}${regulatoryBinding}${positiveSearchCard}<article class="knowledge-card"><h3>${escapeHtml(labels.products)}</h3><ul>${products}</ul><p><strong>Product information ≠ recommendation</strong></p></article><article class="knowledge-card"><h3>${escapeHtml(labels.gaps)}</h3><ul>${gaps}</ul><p>Human Review: ${projection.humanReviewRequired ? "REQUIRED" : "NOT REQUIRED"}</p></article></div><div class="detail-grid"><div><h3>${escapeHtml(labels.provenance)}</h3><ul>${provenance}</ul></div><aside class="boundary-note"><span aria-hidden="true">!</span><div><strong>Case Evidence ≠ Canonical Knowledge</strong><p>Manufacturer claim ≠ Regulatory Authority · Registration identity ≠ crop-target-use authority · approved rate fact ≠ Case recommendation · official label fact ≠ Case recommendation · CHEMICAL_REVIEW ≠ product selection.</p></div></aside></div>`;
  if (projection.productComparison) {
    const comparisonHtml = renderProductComparison(projection.productComparison, language)
      .replaceAll("\u00c2\u00b7", "\u00b7")
      .replaceAll("\u00e2\u2030\u00a0", "\u2260");
    target.querySelector(".grid-3.corpus-grid")?.insertAdjacentHTML("beforeend", comparisonHtml);
  }
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
  renderIntegratedKnowledge();
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
  const [thaiResponse, englishResponse, dataResponse, governedResponse, integratedResponse] = await Promise.all([
    fetch("assets/i18n/th.json"),
    fetch("assets/i18n/en.json"),
    fetch("assets/data/mock-knowledge.json"),
    fetch("assets/data/governed-batch-001.json"),
    fetch("assets/data/multi-source-integration-001.json"),
  ]);
  if (!thaiResponse.ok || !englishResponse.ok) throw new Error("Localization dictionaries unavailable");
  messages = { th: await thaiResponse.json(), en: await englishResponse.json() };
  if (dataResponse.ok) knowledgeData = await dataResponse.json();
  if (governedResponse.ok) governedBatchData = await governedResponse.json();
  if (integratedResponse.ok) integratedKnowledgeData = await integratedResponse.json();
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
  projectProductComparison,
  projectIntegratedKnowledge,
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

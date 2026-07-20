const page = document.body.dataset.page || "home";

const navItems = [
  ["home", "Home", "index.html"],
  ["search", "Search", "search.html"],
  ["browse", "Browse", "browse.html"],
  ["governance", "Governance", "governance.html"],
  ["about", "About", "about.html"],
];

const header = document.querySelector("[data-site-header]");
if (header) {
  header.innerHTML = `
    <a class="brand" href="index.html" aria-label="CP-MoAKB Knowledge Explorer home">
      <span class="brand-mark" aria-hidden="true">CP</span>
      <span><strong>CP-MoAKB</strong><small>Knowledge Explorer</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
      ${navItems.map(([key, label, href]) => `<a href="${href}" ${page === key ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
    </nav>
    <a class="header-cta" href="search.html">Explore knowledge</a>`;
  const toggle = header.querySelector(".menu-toggle");
  const nav = header.querySelector(".site-nav");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
}

const footer = document.querySelector("[data-site-footer]");
if (footer) {
  footer.innerHTML = `
    <div><strong>CP-MoAKB Knowledge Explorer</strong><p>Product-vision prototype · no production knowledge or Runtime.</p></div>
    <div><div class="footer-links"><a href="governance.html">Governance</a><a href="components.html">Components</a><a href="about.html">About</a></div><small data-deployment>Preview deployment identity unavailable locally.</small></div>`;
}

const loadDeployment = async () => {
  try {
    const response = await fetch("deployment.json");
    if (!response.ok) return;
    const metadata = await response.json();
    if (metadata.deployment_mode !== "preview" || metadata.status !== "fictional-placeholder") return;
    const target = document.querySelector("[data-deployment]");
    if (target) target.textContent = `Preview ${String(metadata.commit).slice(0, 12)} · ${metadata.build_timestamp} · package ${metadata.package_version}`;
  } catch {
    // Deployment metadata exists only in the validated Pages artifact.
  }
};

document.querySelectorAll("[data-search-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = new FormData(form).get("q")?.toString().trim() || "placeholder";
    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
  });
});

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const loadData = async () => {
  try {
    const response = await fetch("assets/data/mock-knowledge.json");
    if (!response.ok) throw new Error("Mock data unavailable");
    return await response.json();
  } catch {
    document.querySelectorAll("[data-live-region]").forEach((region) => {
      region.textContent = "Mock data needs a local static server to load.";
    });
    return null;
  }
};

const conceptCard = (concept) => `
  <article class="card concept-card">
    <div class="card-meta"><span class="tag tag-placeholder">Placeholder</span><span>${escapeHtml(concept.type)}</span></div>
    <h3><a href="concept.html">${escapeHtml(concept.title)}</a></h3>
    <p>${escapeHtml(concept.definition)}</p>
    <div class="card-footer"><span class="lifecycle-dot"></span>${escapeHtml(concept.lifecycle)}<a href="concept.html">View concept <span aria-hidden="true">→</span></a></div>
  </article>`;

const initHome = (data) => {
  const stats = document.querySelector("[data-stats]");
  if (stats) stats.innerHTML = data.statistics.map((item) => `<div class="stat"><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></div>`).join("");
  const latest = document.querySelector("[data-latest-concepts]");
  if (latest) latest.innerHTML = data.concepts.slice(0, 3).map(conceptCard).join("");
  const sources = document.querySelector("[data-latest-sources]");
  if (sources) sources.innerHTML = data.sources.map((source) => `<a class="source-row" href="source.html"><span class="source-icon">S</span><span><strong>${escapeHtml(source.title)}</strong><small>${escapeHtml(source.authority)}</small></span><span aria-hidden="true">→</span></a>`).join("");
};

const initSearch = (data) => {
  const params = new URLSearchParams(window.location.search);
  const input = document.querySelector("[data-search-input]");
  if (input) input.value = params.get("q") || "rice";
  const results = document.querySelector("[data-results]");
  const count = document.querySelector("[data-result-count]");
  const filters = [...document.querySelectorAll("[data-filter]")];
  const render = (type = "all") => {
    const items = [
      ...data.concepts.map((item) => ({ ...item, resultType: "Concept" })),
      ...data.evidence.map((item) => ({ ...item, resultType: "Evidence", definition: item.limitations, lifecycle: item.status })),
      ...data.sources.map((item) => ({ ...item, resultType: "Source", definition: item.scope, lifecycle: item.status })),
    ].filter((item) => type === "all" || item.resultType.toLowerCase() === type);
    if (count) count.textContent = `${items.length} fictional placeholder results`;
    if (results) results.innerHTML = items.map((item) => `<article class="result-card"><span class="tag tag-${item.resultType.toLowerCase()}">${item.resultType}</span><div><h3><a href="${item.resultType.toLowerCase()}.html">${escapeHtml(item.title)}</a></h3><p>${escapeHtml(item.definition)}</p><small>${escapeHtml(item.lifecycle)}</small></div><span class="result-arrow" aria-hidden="true">→</span></article>`).join("");
  };
  filters.forEach((button) => button.addEventListener("click", () => {
    filters.forEach((item) => item.setAttribute("aria-pressed", "false"));
    button.setAttribute("aria-pressed", "true");
    render(button.dataset.filter);
  }));
  render();
};

const initConcept = (data) => {
  const concept = data.concepts[0];
  document.querySelectorAll("[data-concept-title]").forEach((el) => { el.textContent = concept.title; });
  const definition = document.querySelector("[data-concept-definition]");
  if (definition) definition.textContent = concept.definition;
  const relationships = document.querySelector("[data-relationships]");
  if (relationships) relationships.innerHTML = concept.relationships.map((item) => `<a class="relationship-chip" href="${item.target.includes("Evidence") ? "evidence.html" : item.target.includes("Authority") ? "authority.html" : "concept.html"}"><span>${escapeHtml(item.predicate)}</span><strong>${escapeHtml(item.target)}</strong></a>`).join("");
};

const initDetail = (data) => {
  const evidence = data.evidence[0];
  document.querySelectorAll("[data-evidence-title]").forEach((el) => { el.textContent = evidence.title; });
  const source = data.sources[0];
  document.querySelectorAll("[data-source-title]").forEach((el) => { el.textContent = source.title; });
  const authority = data.authorities[0];
  document.querySelectorAll("[data-authority-title]").forEach((el) => { el.textContent = authority.name; });
};

document.querySelectorAll("[data-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const group = tab.closest("[data-tabs]");
    group?.querySelectorAll("[data-tab]").forEach((item) => item.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    document.getElementById(tab.getAttribute("aria-controls"))?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

loadData().then((data) => {
  if (!data) return;
  if (page === "home") initHome(data);
  if (page === "search") initSearch(data);
  if (["concept", "components"].includes(page)) initConcept(data);
  initDetail(data);
});
loadDeployment();

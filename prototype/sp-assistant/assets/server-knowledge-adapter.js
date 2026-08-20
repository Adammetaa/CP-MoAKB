export class ServerKnowledgeAdapter {
  async request(path) {
    const response = await fetch(path, { credentials:"same-origin", headers:{ accept:"application/json" } });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || "ไม่สามารถเชื่อมต่อคลังความรู้ได้");
    return payload;
  }
  summary() { return this.request("/api/knowledge/summary"); }
  search(query, domain = "") {
    const params = new URLSearchParams({ q:query }); if (domain) params.set("domain", domain);
    return this.request(`/api/knowledge/search?${params}`);
  }
}

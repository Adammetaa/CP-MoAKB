import { readFile } from "node:fs/promises";

export class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

export async function loadConfiguration() {
  return JSON.parse(await readFile(new URL("../assets/field-config.json", import.meta.url), "utf8"));
}

export async function loadInvestigationConfiguration() {
  return JSON.parse(await readFile(new URL("../assets/investigation-config.json", import.meta.url), "utf8"));
}

export function trianglePoints(offset = 0) {
  return [
    { latitude: 13.75 + offset, longitude: 100.50 + offset },
    { latitude: 13.75 + offset, longitude: 100.51 + offset },
    { latitude: 13.76 + offset, longitude: 100.505 + offset },
  ];
}

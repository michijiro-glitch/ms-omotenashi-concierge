export const STORAGE_METHODS = ["常温", "冷蔵", "冷凍"];

export function textIncludes(haystack, query) {
  return haystack.toLocaleLowerCase("ja").includes(query.toLocaleLowerCase("ja"));
}

export function matchesQuery(parts, query) {
  const q = String(query || "").trim();
  if (!q) return true;
  return textIncludes(parts.filter(Boolean).join("\n"), q);
}

export function matchesAny(values, selected) {
  if (!selected.length) return true;
  return selected.some((item) => values.includes(item));
}

export function storageMethod(keeping) {
  const text = String(keeping || "");
  return STORAGE_METHODS.find((method) => text.includes(method)) || "";
}

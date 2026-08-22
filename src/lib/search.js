export const STORAGE_METHODS = ["常温", "冷蔵", "冷凍"];

const QUERY_SPLIT = /[\s　、。・，,／\/]+|(?:から|まで|して|する|したい|行きたい|で|と|の|に|を|は|が|も|へ|や)/;
const QUERY_STOP = new Set([
  "店",
  "お店",
  "レストラン",
  "手土産",
  "お土産",
  "お取り寄せ",
  "もの",
  "する",
  "したい",
  "行きたい",
  "ください",
]);

export function textIncludes(haystack, query) {
  return haystack.toLocaleLowerCase("ja").includes(query.toLocaleLowerCase("ja"));
}

export function queryTokens(query) {
  return String(query)
    .trim()
    .split(QUERY_SPLIT)
    .map((token) => token.trim())
    .filter((token) => token && !QUERY_STOP.has(token));
}

export function matchesQuery(parts, query) {
  const q = String(query || "").trim();
  if (!q) return true;
  const haystack = parts.filter(Boolean).join("\n");
  if (textIncludes(haystack, q)) return true;
  const tokens = queryTokens(q);
  if (!tokens.length) return true;
  return tokens.every((token) => textIncludes(haystack, token));
}

export function matchesAny(values, selected) {
  if (!selected.length) return true;
  return selected.some((item) => values.includes(item));
}

export function storageMethod(keeping) {
  const text = String(keeping || "");
  return STORAGE_METHODS.find((method) => text.includes(method)) || "";
}

import {
  DOG_POLICIES,
  FORMALITY,
  GENRES,
  GIFT_CATEGORIES,
  GIFT_RECIPIENTS,
  MOODS,
  PRICE_RANGES,
  REGIONS,
  SCENES,
  STATUSES,
  TOKYO_AREAS,
} from "./formOptions.js";

export const STORAGE_METHODS = ["常温", "冷蔵", "冷凍"];

const QUERY_SPLIT =
  /[\s　、。・，,／\/]+|(?:から|まで|して|する|したい|行きたい|使える|ください|で|と|の|に|を|は|が|も|へ|や|な)/;
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
  "使える",
  "ください",
]);

const GENERIC_OPTIONS = new Set(["その他", "可", "不可"]);

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

export function matchesAll(values, selected) {
  if (!selected.length) return true;
  return selected.every((item) => values.includes(item));
}

export function storageMethod(keeping) {
  const text = String(keeping || "");
  return STORAGE_METHODS.find((method) => text.includes(method)) || "";
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function longestFirst(values) {
  return unique(values).sort((a, b) => b.length - a.length || a.localeCompare(b, "ja"));
}

function optionNeedles(value) {
  const needles = [value];
  String(value)
    .split(/[・／/]/)
    .map((part) => part.trim())
    .filter((part) => part.length >= 2 && part !== value)
    .forEach((part) => needles.push(part));
  return needles;
}

function consumeOptions(text, values, { minLength = 2 } = {}) {
  const hits = [];
  let rest = String(text ?? "");
  for (const value of longestFirst(values)) {
    if (value.length < minLength || GENERIC_OPTIONS.has(value)) continue;
    for (const needle of longestFirst(optionNeedles(value))) {
      if (needle.length < minLength) continue;
      if (!rest.includes(needle)) continue;
      hits.push(value);
      rest = rest.split(needle).join(" ");
      break;
    }
  }
  return { hits: unique(hits), rest };
}

function firstHit(hits) {
  return hits[0] || "";
}

function applyAliases(rest, aliases) {
  let next = rest;
  const applied = [];
  for (const { needle, field, value } of aliases) {
    if (!needle || needle.length < 2) continue;
    if (!next.includes(needle)) continue;
    applied.push({ field, value });
    next = next.split(needle).join(" ");
  }
  return { applied, rest: next };
}

const RESTAURANT_ALIASES = [
  { needle: "個室", field: "moods", value: "個室あり" },
  { needle: "カウンター席", field: "moods", value: "カウンター" },
  { needle: "テラス席", field: "moods", value: "テラス" },
  { needle: "接待", field: "scenes", value: "重要な接待" },
  { needle: "犬連れ", field: "dogPolicy", value: "可" },
  { needle: "ペット可", field: "dogPolicy", value: "可" },
];

const GIFT_ALIASES = [
  { needle: "取引先", field: "recipients", value: "取引先" },
  { needle: "日持ち", field: "storage", value: "常温" },
];

export function emptyRestaurantQueryParse() {
  return {
    area: "",
    genre: "",
    priceRange: "",
    status: "",
    formality: "",
    dogPolicy: "",
    scenes: [],
    moods: [],
    restQuery: "",
  };
}

export function parseRestaurantQuery(query, catalogs = {}) {
  const text = String(query || "").trim();
  if (!text) return emptyRestaurantQueryParse();

  const areas = unique([...(catalogs.areas || []), ...TOKYO_AREAS, ...REGIONS]);
  const genres = unique([...(catalogs.genres || []), ...GENRES]);
  const priceRanges = unique([...(catalogs.priceRanges || []), ...PRICE_RANGES]);

  let rest = text;
  const area = consumeOptions(rest, areas);
  rest = area.rest;
  const genre = consumeOptions(rest, genres);
  rest = genre.rest;
  const price = consumeOptions(rest, priceRanges);
  rest = price.rest;
  const status = consumeOptions(rest, STATUSES);
  rest = status.rest;
  const formality = consumeOptions(rest, FORMALITY);
  rest = formality.rest;
  const dog = consumeOptions(rest, DOG_POLICIES.filter((item) => !GENERIC_OPTIONS.has(item)));
  rest = dog.rest;
  const scenes = consumeOptions(rest, SCENES);
  rest = scenes.rest;
  const moods = consumeOptions(rest, MOODS);
  rest = moods.rest;

  const aliases = applyAliases(rest, RESTAURANT_ALIASES);
  rest = aliases.rest;

  const parsed = {
    area: firstHit(area.hits),
    genre: firstHit(genre.hits),
    priceRange: firstHit(price.hits),
    status: firstHit(status.hits),
    formality: firstHit(formality.hits),
    dogPolicy: firstHit(dog.hits),
    scenes: [...scenes.hits],
    moods: [...moods.hits],
    restQuery: queryTokens(rest).join(" "),
  };

  for (const { field, value } of aliases.applied) {
    if (field === "scenes" && !parsed.scenes.includes(value)) parsed.scenes.push(value);
    else if (field === "moods" && !parsed.moods.includes(value)) parsed.moods.push(value);
    else if (field === "dogPolicy" && !parsed.dogPolicy) parsed.dogPolicy = value;
    else if (field === "area" && !parsed.area) parsed.area = value;
    else if (field === "genre" && !parsed.genre) parsed.genre = value;
    else if (field === "formality" && !parsed.formality) parsed.formality = value;
    else if (field === "status" && !parsed.status) parsed.status = value;
  }

  return parsed;
}

export function emptyGiftQueryParse() {
  return {
    category: "",
    priceRange: "",
    storage: "",
    recipients: [],
    restQuery: "",
  };
}

export function parseGiftQuery(query, catalogs = {}) {
  const text = String(query || "").trim();
  if (!text) return emptyGiftQueryParse();

  const categories = unique([...(catalogs.categories || []), ...GIFT_CATEGORIES]);
  const priceRanges = unique([...(catalogs.priceRanges || []), ...PRICE_RANGES]);
  const storages = unique([...(catalogs.storages || []), ...STORAGE_METHODS]);
  const recipients = unique([...(catalogs.recipients || []), ...GIFT_RECIPIENTS]);

  let rest = text;
  const category = consumeOptions(rest, categories, { minLength: 1 });
  rest = category.rest;
  const price = consumeOptions(rest, priceRanges);
  rest = price.rest;
  const storage = consumeOptions(rest, storages);
  rest = storage.rest;
  const recipientHits = consumeOptions(rest, recipients);
  rest = recipientHits.rest;

  const aliases = applyAliases(rest, GIFT_ALIASES);
  rest = aliases.rest;

  const parsed = {
    category: firstHit(category.hits),
    priceRange: firstHit(price.hits),
    storage: firstHit(storage.hits),
    recipients: [...recipientHits.hits],
    restQuery: queryTokens(rest).join(" "),
  };

  for (const { field, value } of aliases.applied) {
    if (field === "recipients" && !parsed.recipients.includes(value)) parsed.recipients.push(value);
    else if (field === "storage" && !parsed.storage) parsed.storage = value;
    else if (field === "category" && !parsed.category) parsed.category = value;
  }

  return parsed;
}

export function everyValue(actual, ...wanted) {
  return wanted.filter(Boolean).every((value) => actual === value);
}

import { parseCsv } from "./csv.js";
import { mapGifts, mapRestaurants } from "./sheetMap.js";

async function fetchCsv(url) {
  const joiner = url.includes("?") ? "&" : "?";
  const response = await fetch(`${url}${joiner}_=${Date.now()}`);
  if (!response.ok) {
    throw new Error(`CSV ${response.status}`);
  }
  return response.text();
}

function mergeById(sheetItems, localItems) {
  const ids = new Set(sheetItems.map((item) => item.id));
  const names = new Set(sheetItems.map((item) => item.name));
  return [...sheetItems, ...localItems.filter((item) => !ids.has(item.id) && !names.has(item.name))];
}

export async function loadRestaurants(fallback) {
  const url = import.meta.env.VITE_RESTAURANTS_CSV_URL;
  if (!url) return { items: fallback, source: "local" };

  try {
    const items = mapRestaurants(parseCsv(await fetchCsv(url)));
    if (items.length === 0) return { items: fallback, source: "local" };
    return { items: mergeById(items, fallback), source: "sheet" };
  } catch {
    return { items: fallback, source: "local" };
  }
}

export async function loadGifts(fallback) {
  const url = import.meta.env.VITE_GIFTS_CSV_URL;
  if (!url) return { items: fallback, source: "local" };

  try {
    const items = mapGifts(parseCsv(await fetchCsv(url)));
    if (items.length === 0) return { items: fallback, source: "local" };
    return { items: mergeById(items, fallback), source: "sheet" };
  } catch {
    return { items: fallback, source: "local" };
  }
}

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

async function loadSheet(url, mapRows, fallback) {
  if (!url) return { items: fallback, source: "local" };

  try {
    return { items: mapRows(parseCsv(await fetchCsv(url))), source: "sheet" };
  } catch {
    return { items: null, source: "error" };
  }
}

export function loadRestaurants(fallback) {
  return loadSheet(import.meta.env.VITE_RESTAURANTS_CSV_URL, mapRestaurants, fallback);
}

export function loadGifts(fallback) {
  return loadSheet(import.meta.env.VITE_GIFTS_CSV_URL, mapGifts, fallback);
}

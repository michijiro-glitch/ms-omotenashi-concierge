import { matchesAny, matchesQuery } from "./search.js";

export function areaLabel(restaurant) {
  return restaurant.tokyoArea || restaurant.otherArea || restaurant.region;
}

export function photoSrc(photo) {
  if (!photo) return "";
  const src = typeof photo === "string" ? photo : photo.src;
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const file = src.replace(/^\/+/, "").replace(/^photos\//, "");
  return `${import.meta.env.BASE_URL}photos/${file}`;
}

export function firstPhoto(restaurant) {
  return restaurant.photos?.[0] ? photoSrc(restaurant.photos[0]) : "";
}

export function isDogOk(restaurant) {
  return restaurant.dogPolicy === "可" || restaurant.dogPolicy === "テラス席のみ可";
}

export function cardTags(restaurant) {
  const tags = [restaurant.formality, ...restaurant.scenes, ...restaurant.moods];
  if (isDogOk(restaurant)) {
    tags.push(`犬連れ${restaurant.dogPolicy}`);
  }
  return tags.filter(Boolean);
}

export function uniqueValues(restaurants, getValue) {
  return [...new Set(restaurants.map(getValue).filter(Boolean))];
}

const PRICE_ORDER = [
  "〜3,000円",
  "3,000〜5,000円",
  "5,000〜8,000円",
  "8,000〜12,000円",
  "12,000〜20,000円",
  "20,000円〜",
];

export function sortPriceRanges(ranges) {
  return [...ranges].sort((a, b) => {
    const indexA = PRICE_ORDER.indexOf(a);
    const indexB = PRICE_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b, "ja");
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

export function matchesRestaurant(restaurant, filters) {
  const { area, genre, priceRange, status, formality, dogPolicy, scenes, moods, query } = filters;
  if (area && areaLabel(restaurant) !== area) return false;
  if (genre && restaurant.genre !== genre) return false;
  if (priceRange && restaurant.priceRange !== priceRange) return false;
  if (status && restaurant.status !== status) return false;
  if (formality && restaurant.formality !== formality) return false;
  if (dogPolicy && restaurant.dogPolicy !== dogPolicy) return false;
  if (!matchesAny(restaurant.scenes || [], scenes || [])) return false;
  if (!matchesAny(restaurant.moods || [], moods || [])) return false;

  return matchesQuery(
    [
      restaurant.name,
      areaLabel(restaurant),
      restaurant.genre,
      restaurant.recommend,
      restaurant.oneLiner,
      restaurant.memo,
      restaurant.mediaName,
      restaurant.caution,
    ],
    query,
  );
}

export { textIncludes } from "./search.js";

import { photoSrc } from "./restaurants.js";
import { everyValue, matchesAll, matchesAny, matchesQuery, parseGiftQuery, storageMethod } from "./search.js";

export function firstGiftPhoto(gift) {
  return gift.photos?.[0] ? photoSrc(gift.photos[0]) : "";
}

export function matchesGift(gift, filters) {
  const { category, recipients, priceRange, storage, query, catalogs } = filters;
  const parsed = filters.parsed || parseGiftQuery(query, catalogs);
  if (!everyValue(gift.category, category, parsed.category)) return false;
  if (!everyValue(gift.priceRange, priceRange, parsed.priceRange)) return false;
  if (!everyValue(storageMethod(gift.keeping), storage, parsed.storage)) return false;
  if (!matchesAny(gift.recipients || [], recipients || [])) return false;
  if (!matchesAll(gift.recipients || [], parsed.recipients || [])) return false;

  return matchesQuery(
    [
      gift.name,
      gift.brand,
      gift.category,
      gift.recommend,
      gift.caution,
      gift.keeping,
      gift.mediaName,
      gift.mediaUrl,
      ...(gift.recipients || []),
    ],
    parsed.restQuery,
  );
}

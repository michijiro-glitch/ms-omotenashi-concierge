import { photoSrc } from "./restaurants.js";
import { matchesAny, matchesQuery, storageMethod } from "./search.js";

export function firstGiftPhoto(gift) {
  return gift.photos?.[0] ? photoSrc(gift.photos[0]) : "";
}

export function matchesGift(gift, filters) {
  const { category, recipients, priceRange, storage, query } = filters;
  if (category && gift.category !== category) return false;
  if (priceRange && gift.priceRange !== priceRange) return false;
  if (storage && storageMethod(gift.keeping) !== storage) return false;
  if (!matchesAny(gift.recipients || [], recipients || [])) return false;

  return matchesQuery(
    [gift.name, gift.brand, gift.recommend, gift.caution, gift.keeping, gift.mediaName, gift.mediaUrl],
    query,
  );
}

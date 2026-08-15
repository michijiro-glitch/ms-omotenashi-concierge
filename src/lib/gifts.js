import { photoSrc, textIncludes } from "./restaurants.js";

export function firstGiftPhoto(gift) {
  return gift.photos?.[0] ? photoSrc(gift.photos[0]) : "";
}

export function matchesGift(gift, { category, recipient, query }) {
  if (category && gift.category !== category) return false;
  if (recipient && !gift.recipients.includes(recipient)) return false;

  const q = query.trim();
  if (!q) return true;

  const haystack = [gift.name, gift.brand, gift.recommend, gift.caution, ...gift.recipients]
    .filter(Boolean)
    .join("\n");

  return textIncludes(haystack, q);
}

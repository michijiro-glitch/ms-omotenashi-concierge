import { CHOICES } from "../data/choices.js";

export function getActiveChoices(choices = CHOICES) {
  return choices.filter((choice) => choice.active).sort((a, b) => a.order - b.order);
}

export function getChoiceBySlug(slug, choices = CHOICES) {
  return choices.find((choice) => choice.slug === slug) || null;
}

export function withChoicePicks(choices, picksBySlug) {
  if (!picksBySlug) return choices;
  return choices.map((choice) => {
    if (!Object.prototype.hasOwnProperty.call(picksBySlug, choice.slug)) return choice;
    const picks = Array.isArray(picksBySlug[choice.slug]) ? picksBySlug[choice.slug] : [];
    return { ...choice, picks };
  });
}

export function resolvePicks(choice, restaurants, gifts) {
  if (!choice) return [];
  const restaurantsById = new Map(restaurants.map((item) => [item.id, item]));
  const giftsById = new Map(gifts.map((item) => [item.id, item]));

  return [...(choice.picks || [])]
    .sort((a, b) => a.order - b.order)
    .map((pick) => {
      const item = pick.type === "gift" ? giftsById.get(pick.id) : restaurantsById.get(pick.id);
      if (!item) return null;
      return { ...pick, item };
    })
    .filter(Boolean);
}

export function groupPicksByCategory(picks) {
  const groups = [];
  const index = new Map();

  for (const pick of picks) {
    const key = pick.categoryJa || "";
    if (!index.has(key)) {
      const group = { categoryJa: pick.categoryJa || "", categoryEn: pick.categoryEn || "", picks: [] };
      index.set(key, group);
      groups.push(group);
    }
    index.get(key).picks.push(pick);
  }

  return groups;
}

export function choicePath(slug) {
  return `/choice/${slug}`;
}

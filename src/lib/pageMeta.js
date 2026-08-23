export const SITE_NAME = "M's Omotenashi Concierge";

export const DESCRIPTIONS = {
  home: "実際に訪れてよかった店と、贈って喜ばれた手土産を、M自身の経験で集めたパーソナル・コンシェルジュです。",
  restaurants:
    "M's Visit（実際に訪問）と M's Wishlist（行ってみたい）のレストラン一覧。エリア・ジャンル・利用シーンから探せます。",
  gifts: "贈って喜ばれた手土産・お取り寄せの一覧。相手・用途やカテゴリから探せます。",
};

export function fullTitle(...parts) {
  const unique = [];
  for (const part of parts) {
    const text = String(part || "").trim();
    if (text && !unique.includes(text)) unique.push(text);
  }
  if (!unique.includes(SITE_NAME)) unique.push(SITE_NAME);
  return unique.join(" | ");
}

export function clipMeta(text, max = 120) {
  const t = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

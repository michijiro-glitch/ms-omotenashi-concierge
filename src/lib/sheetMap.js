import { cell, photoList, splitList, toNumberOrNull } from "./csv.js";

export function rowToRestaurant(record, index) {
  const name = cell(record, "店名");
  if (!name) return null;

  return {
    id: cell(record, "id") || name,
    name,
    status: cell(record, "ステータス") || "行ってみたい",
    region: cell(record, "地域区分"),
    tokyoArea: cell(record, "都内エリア"),
    otherArea: cell(record, "地方・海外エリア"),
    genre: cell(record, "ジャンル"),
    priceRange: cell(record, "価格帯"),
    formality: cell(record, "フォーマル度"),
    scenes: splitList(cell(record, "利用シーン")),
    moods: splitList(cell(record, "雰囲気")),
    dogPolicy: cell(record, "犬連れ") || "要確認",
    recommend: cell(record, "おすすめポイント"),
    caution: cell(record, "注意点"),
    oneLiner: cell(record, "ひとこと評価"),
    memo: cell(record, "自由メモ"),
    lastVisit: cell(record, "最終訪問日"),
    photos: photoList(record),
    officialUrl: cell(record, "公式HP URL"),
    tabelogUrl: cell(record, "食べログURL"),
    reserveUrl: cell(record, "予約URL"),
    mediaName: cell(record, "メディア掲載名"),
    mediaUrl: cell(record, "メディア掲載URL"),
    wantToGoAgain: toNumberOrNull(cell(record, "また行きたい度")),
    _row: index,
  };
}

export function rowToGift(record, index) {
  const name = cell(record, "商品名", "商品名・");
  if (!name) return null;

  return {
    id: cell(record, "id") || name,
    name,
    brand: cell(record, "店名・ブランド", "店名・"),
    category: cell(record, "カテゴリ"),
    priceRange: cell(record, "価格帯"),
    recipients: splitList(cell(record, "向いている相手・用途")),
    keeping: cell(record, "日持ち・保存"),
    purchaseUrl: cell(record, "購入先URL", "購入先／公式URL"),
    recommend: cell(record, "おすすめポイント"),
    caution: cell(record, "注意点・メモ", "注意点"),
    photos: photoList(record),
    mediaName: cell(record, "メディア掲載名"),
    mediaUrl: cell(record, "メディア掲載URL"),
    wantToUseAgain: toNumberOrNull(cell(record, "また使いたい度")),
    _row: index,
  };
}

function uniquifyIds(items) {
  const seen = new Map();
  return items.map((item) => {
    const base = String(item.id);
    const count = seen.get(base) || 0;
    seen.set(base, count + 1);
    if (count === 0) return item;
    return { ...item, id: `${base}-${count + 1}` };
  });
}

export function mapRestaurants(records) {
  return uniquifyIds(records.map(rowToRestaurant).filter(Boolean));
}

export function mapGifts(records) {
  return uniquifyIds(records.map(rowToGift).filter(Boolean));
}

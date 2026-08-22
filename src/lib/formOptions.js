export const STATUSES = ["行ったことがある", "行ってみたい"];
export const STATUS_LABELS = {
  行ったことがある: "M's Visit｜実際に訪問",
  行ってみたい: "M's Wishlist｜行ってみたい",
};

export function statusLabel(status) {
  return STATUS_LABELS[status] || STATUS_LABELS["行ってみたい"];
}
export const REGIONS = ["東京", "国内地方", "海外", "その他"];
export const TOKYO_AREAS = [
  "銀座", "有楽町", "丸の内", "日本橋", "京橋", "六本木", "麻布十番", "赤坂", "虎ノ門", "新橋",
  "恵比寿", "代官山", "中目黒", "渋谷", "表参道", "青山", "広尾", "白金", "目黒", "品川",
  "新宿", "神楽坂", "神保町", "浅草", "上野", "その他",
];
export const GENRES = [
  "和食", "寿司", "天ぷら", "焼鳥", "焼肉", "鉄板焼", "すき焼き・しゃぶしゃぶ", "うなぎ", "そば・うどん",
  "割烹・懐石", "フレンチ", "イタリアン", "スペイン料理", "中華", "韓国料理", "アジア・エスニック",
  "洋食", "ステーキ", "ビストロ", "居酒屋", "バー", "ワインバー", "カフェ", "スイーツ", "その他",
];
export const PRICE_RANGES = [
  "〜3,000円", "3,000〜5,000円", "5,000〜8,000円", "8,000〜12,000円", "12,000〜20,000円", "20,000円〜",
];
export const FORMALITY = ["フォーマル", "きちんと", "上質カジュアル", "カジュアル", "とても気軽"];
export const SCENES = ["重要な接待", "仕事の会食", "友人", "家族", "デート", "一人", "ランチ", "二次会", "記念日"];
export const MOODS = ["静か", "落ち着いている", "活気あり", "眺望が良い", "隠れ家", "個室あり", "カウンター", "テラス"];
export const DOG_POLICIES = ["可", "不可", "テラス席のみ可", "要確認"];
export const GIFT_CATEGORIES = ["高級", "菓子", "酒", "その他"];
export const GIFT_RECIPIENTS = ["取引先", "友人", "家族", "自分用"];
export const RATINGS = ["1", "2", "3", "4", "5"];

export function toDateInput(value) {
  const text = String(value || "").trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const jp = text.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (!jp) return "";
  return `${jp[1]}-${String(jp[2]).padStart(2, "0")}-${String(jp[3]).padStart(2, "0")}`;
}

import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import GiftCard from "../components/GiftCard.jsx";
import ListHeader from "../components/ListHeader.jsx";
import { useData } from "../data/DataProvider.jsx";
import { matchesGift } from "../lib/gifts.js";
import { uniqueValues } from "../lib/restaurants.js";
import { getParam, setParam } from "../lib/urlState.js";

export default function GiftList() {
  const { gifts, loading } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = getParam(searchParams, "q");
  const category = getParam(searchParams, "category");
  const recipient = getParam(searchParams, "recipient");

  const update = (key, value) => setParam(searchParams, setSearchParams, key, value);

  const categories = useMemo(
    () => uniqueValues(gifts, (item) => item.category).sort((a, b) => a.localeCompare(b, "ja")),
    [gifts],
  );
  const recipients = useMemo(
    () =>
      [...new Set(gifts.flatMap((item) => item.recipients).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "ja"),
      ),
    [gifts],
  );

  const filtered = gifts.filter((gift) => matchesGift(gift, { category, recipient, query }));

  return (
    <div className="page">
      <ListHeader title="手土産・お取り寄せ" addTo="/gifts/new" />

      <div className="toolbar">
        <label className="search">
          <span className="sr-only">手土産・お取り寄せを探す</span>
          <input
            type="search"
            value={query}
            onChange={(event) => update("q", event.target.value)}
            placeholder="どんな手土産・お取り寄せを探しますか？"
          />
        </label>

        <div className="filters filters-2">
          <select
            aria-label="カテゴリ"
            value={category}
            onChange={(event) => update("category", event.target.value)}
          >
            <option value="">カテゴリ：すべて</option>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            aria-label="相手・用途"
            value={recipient}
            onChange={(event) => update("recipient", event.target.value)}
          >
            <option value="">相手・用途：すべて</option>
            {recipients.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="count">{loading ? "読み込み中…" : `${filtered.length}件`}</p>

      {filtered.length === 0 ? (
        <p className="empty">条件に合う手土産・お取り寄せはまだありません。</p>
      ) : (
        <div className="card-grid">
          {filtered.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      )}
    </div>
  );
}

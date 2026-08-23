import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CheckFilter from "../components/CheckFilter.jsx";
import FilterSelect from "../components/FilterSelect.jsx";
import GiftCard from "../components/GiftCard.jsx";
import ListHeader from "../components/ListHeader.jsx";
import SearchBar from "../components/SearchBar.jsx";
import SearchMeta from "../components/SearchMeta.jsx";
import PageMeta from "../components/PageMeta.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useData } from "../data/DataProvider.jsx";
import { DESCRIPTIONS, fullTitle } from "../lib/pageMeta.js";
import { GIFT_RECIPIENTS } from "../lib/formOptions.js";
import { matchesGift } from "../lib/gifts.js";
import { sortPriceRanges, uniqueValues } from "../lib/restaurants.js";
import { STORAGE_METHODS, storageMethod } from "../lib/search.js";
import { clearParams, getList, getParam, hasParams, setParam, toggleList } from "../lib/urlState.js";

const FILTER_KEYS = ["q", "category", "recipients", "recipient", "price", "storage"];

export default function GiftList() {
  const { gifts, loading, giftError } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = getParam(searchParams, "q");
  const category = getParam(searchParams, "category");
  const priceRange = getParam(searchParams, "price");
  const storage = getParam(searchParams, "storage");
  const recipients = getList(searchParams, "recipients");
  const legacyRecipient = getParam(searchParams, "recipient");
  const selectedRecipients = recipients.length ? recipients : legacyRecipient ? [legacyRecipient] : [];

  const update = (key, value) => setParam(searchParams, setSearchParams, key, value);
  const toggle = (key, value) => toggleList(searchParams, setSearchParams, key, value);

  const categories = useMemo(
    () => uniqueValues(gifts, (item) => item.category).sort((a, b) => a.localeCompare(b, "ja")),
    [gifts],
  );
  const priceRanges = useMemo(
    () => sortPriceRanges(uniqueValues(gifts, (item) => item.priceRange)),
    [gifts],
  );
  const storages = useMemo(() => {
    const found = uniqueValues(gifts, (item) => storageMethod(item.keeping));
    return STORAGE_METHODS.filter((method) => found.includes(method));
  }, [gifts]);

  const filtered = gifts.filter((gift) =>
    matchesGift(gift, {
      category,
      recipients: selectedRecipients,
      priceRange,
      storage,
      query,
    }),
  );

  return (
    <div className="page">
      <PageMeta title={fullTitle("手土産・お取り寄せ")} description={DESCRIPTIONS.gifts} />
      <ListHeader title="手土産・お取り寄せ" addTo="/gifts/new" />

      <div className="toolbar">
        <SearchBar
          label="手土産・お取り寄せを探す"
          placeholder="どんな手土産・お取り寄せを探しますか？"
          value={query}
          onChange={(value) => update("q", value)}
        />

        <div className="filters">
          <FilterSelect
            label="カテゴリ"
            value={category}
            onChange={(value) => update("category", value)}
            allLabel="カテゴリ：すべて"
            options={categories}
          />
          <FilterSelect
            label="価格帯"
            value={priceRange}
            onChange={(value) => update("price", value)}
            allLabel="価格帯：すべて"
            options={priceRanges}
          />
          {storages.length ? (
            <FilterSelect
              label="保存方法"
              value={storage}
              onChange={(value) => update("storage", value)}
              allLabel="保存方法：すべて"
              options={storages}
            />
          ) : null}
        </div>

        <CheckFilter
          legend="相手・用途"
          options={GIFT_RECIPIENTS}
          values={selectedRecipients}
          onToggle={(value) => {
            if (legacyRecipient) update("recipient", "");
            toggle("recipients", value);
          }}
        />

        <SearchMeta
          count={filtered.length}
          loading={loading}
          hasFilters={hasParams(searchParams, FILTER_KEYS)}
          onClear={() => clearParams(searchParams, setSearchParams, FILTER_KEYS)}
        />
      </div>

      {loading && gifts.length === 0 ? (
        <p className="empty">読み込み中…</p>
      ) : giftError && gifts.length === 0 ? (
        <p className="empty">一覧を読み込めませんでした。少し待ってから再読み込みしてください。</p>
      ) : filtered.length === 0 ? (
        <p className="empty">
          条件に合うものが見つかりませんでした。
          {hasParams(searchParams, FILTER_KEYS) ? (
            <>
              {" "}
              <button type="button" className="clear-filters" onClick={() => clearParams(searchParams, setSearchParams, FILTER_KEYS)}>
                条件をクリア
              </button>
            </>
          ) : null}
        </p>
      ) : (
        <div className="card-grid">
          {filtered.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      )}
      <SiteFooter />
    </div>
  );
}

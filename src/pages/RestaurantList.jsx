import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import CheckFilter from "../components/CheckFilter.jsx";
import FilterSelect from "../components/FilterSelect.jsx";
import ListHeader from "../components/ListHeader.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import SearchMeta from "../components/SearchMeta.jsx";
import PageMeta from "../components/PageMeta.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useData } from "../data/DataProvider.jsx";
import { DESCRIPTIONS, fullTitle } from "../lib/pageMeta.js";
import { DOG_POLICIES, FORMALITY, MOODS, SCENES, STATUSES, statusLabel } from "../lib/formOptions.js";
import { areaLabel, matchesRestaurant, sortPriceRanges, uniqueValues } from "../lib/restaurants.js";
import { clearParams, getList, getParam, hasParams, setParam, toggleList } from "../lib/urlState.js";

const FILTER_KEYS = ["q", "area", "genre", "price", "status", "formality", "dog", "scenes", "moods"];

export default function RestaurantList() {
  const { restaurants, loading, restaurantError } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = getParam(searchParams, "q");
  const area = getParam(searchParams, "area");
  const genre = getParam(searchParams, "genre");
  const priceRange = getParam(searchParams, "price");
  const status = getParam(searchParams, "status");
  const formality = getParam(searchParams, "formality");
  const dogPolicy = getParam(searchParams, "dog");
  const scenes = getList(searchParams, "scenes");
  const moods = getList(searchParams, "moods");

  const update = (key, value) => setParam(searchParams, setSearchParams, key, value);
  const toggle = (key, value) => toggleList(searchParams, setSearchParams, key, value);

  const areas = useMemo(
    () => uniqueValues(restaurants, areaLabel).sort((a, b) => a.localeCompare(b, "ja")),
    [restaurants],
  );
  const genres = useMemo(
    () => uniqueValues(restaurants, (item) => item.genre).sort((a, b) => a.localeCompare(b, "ja")),
    [restaurants],
  );
  const priceRanges = useMemo(
    () => sortPriceRanges(uniqueValues(restaurants, (item) => item.priceRange)),
    [restaurants],
  );

  const filtered = restaurants.filter((restaurant) =>
    matchesRestaurant(restaurant, {
      area,
      genre,
      priceRange,
      status,
      formality,
      dogPolicy,
      scenes,
      moods,
      query,
    }),
  );

  return (
    <div className="page">
      <PageMeta title={fullTitle("レストラン")} description={DESCRIPTIONS.restaurants} />
      <ListHeader title="レストラン" />

      <div className="toolbar">
        <SearchBar
          label="お店を探す"
          placeholder="今日はどんなお店を探しますか？"
          value={query}
          onChange={(value) => update("q", value)}
        />

        <div className="filters">
          <FilterSelect
            label="M's Visit か Wishlist"
            value={status}
            onChange={(value) => update("status", value)}
            allLabel="すべて"
            options={STATUSES.map((option) => ({ value: option, label: statusLabel(option) }))}
          />
          <FilterSelect
            label="エリア"
            value={area}
            onChange={(value) => update("area", value)}
            allLabel="エリア：すべて"
            options={areas}
          />
          <FilterSelect
            label="ジャンル"
            value={genre}
            onChange={(value) => update("genre", value)}
            allLabel="ジャンル：すべて"
            options={genres}
          />
          <FilterSelect
            label="価格帯"
            value={priceRange}
            onChange={(value) => update("price", value)}
            allLabel="価格帯：すべて"
            options={priceRanges}
          />
          <FilterSelect
            label="フォーマル度"
            value={formality}
            onChange={(value) => update("formality", value)}
            allLabel="フォーマル度：すべて"
            options={FORMALITY}
          />
          <FilterSelect
            label="犬連れ"
            value={dogPolicy}
            onChange={(value) => update("dog", value)}
            allLabel="犬連れ：すべて"
            options={DOG_POLICIES}
          />
        </div>

        <CheckFilter legend="利用シーン" options={SCENES} values={scenes} onToggle={(value) => toggle("scenes", value)} />
        <CheckFilter legend="雰囲気" options={MOODS} values={moods} onToggle={(value) => toggle("moods", value)} />

        <SearchMeta
          count={filtered.length}
          loading={loading}
          hasFilters={hasParams(searchParams, FILTER_KEYS)}
          onClear={() => clearParams(searchParams, setSearchParams, FILTER_KEYS)}
        />
      </div>

      {loading && restaurants.length === 0 ? (
        <p className="empty">読み込み中…</p>
      ) : restaurantError && restaurants.length === 0 ? (
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
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
      <SiteFooter />
    </div>
  );
}

import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import restaurants from "../data/restaurants.json";
import ListHeader from "../components/ListHeader.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import { areaLabel, matchesRestaurant, sortPriceRanges, uniqueValues } from "../lib/restaurants.js";
import { getParam, setParam } from "../lib/urlState.js";

export default function RestaurantList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = getParam(searchParams, "q");
  const area = getParam(searchParams, "area");
  const genre = getParam(searchParams, "genre");
  const priceRange = getParam(searchParams, "price");

  const update = (key, value) => setParam(searchParams, setSearchParams, key, value);

  const areas = useMemo(
    () => uniqueValues(restaurants, areaLabel).sort((a, b) => a.localeCompare(b, "ja")),
    [],
  );
  const genres = useMemo(
    () => uniqueValues(restaurants, (r) => r.genre).sort((a, b) => a.localeCompare(b, "ja")),
    [],
  );
  const priceRanges = useMemo(
    () => sortPriceRanges(uniqueValues(restaurants, (r) => r.priceRange)),
    [],
  );

  const filtered = restaurants.filter((restaurant) =>
    matchesRestaurant(restaurant, { area, genre, priceRange, query }),
  );

  return (
    <div className="page">
      <ListHeader title="レストラン" />

      <div className="toolbar">
        <label className="search">
          <span className="sr-only">お店を探す</span>
          <input
            type="search"
            value={query}
            onChange={(event) => update("q", event.target.value)}
            placeholder="今日はどんなお店を探しますか？"
          />
        </label>

        <div className="filters">
          <select
            aria-label="エリア"
            value={area}
            onChange={(event) => update("area", event.target.value)}
          >
            <option value="">エリア：すべて</option>
            {areas.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            aria-label="ジャンル"
            value={genre}
            onChange={(event) => update("genre", event.target.value)}
          >
            <option value="">ジャンル：すべて</option>
            {genres.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            aria-label="価格帯"
            value={priceRange}
            onChange={(event) => update("price", event.target.value)}
          >
            <option value="">価格帯：すべて</option>
            {priceRanges.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="count">{filtered.length}件</p>

      {filtered.length === 0 ? (
        <p className="empty">条件に合う店はまだありません。</p>
      ) : (
        <div className="card-grid">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}

import { createContext, useContext, useEffect, useState } from "react";
import localGifts from "../data/gifts.json";
import localRestaurants from "../data/restaurants.json";
import { loadGifts, loadRestaurants } from "../lib/loadData.js";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [restaurants, setRestaurants] = useState(localRestaurants);
  const [gifts, setGifts] = useState(localGifts);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("local");

  useEffect(() => {
    let cancelled = false;

    Promise.all([loadRestaurants(localRestaurants), loadGifts(localGifts)]).then(([restaurantResult, giftResult]) => {
      if (cancelled) return;
      setRestaurants(restaurantResult.items);
      setGifts(giftResult.items);
      setSource(restaurantResult.source === "sheet" || giftResult.source === "sheet" ? "sheet" : "local");
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DataContext.Provider value={{ restaurants, gifts, loading, source }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const value = useContext(DataContext);
  if (!value) {
    throw new Error("useData は DataProvider の中で使います");
  }
  return value;
}

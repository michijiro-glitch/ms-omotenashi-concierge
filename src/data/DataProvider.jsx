import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import localGifts from "../data/gifts.json";
import localRestaurants from "../data/restaurants.json";
import { loadGifts, loadRestaurants } from "../lib/loadData.js";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [restaurants, setRestaurants] = useState(localRestaurants);
  const [gifts, setGifts] = useState(localGifts);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("local");
  const mounted = useRef(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [restaurantResult, giftResult] = await Promise.all([
      loadRestaurants(localRestaurants),
      loadGifts(localGifts),
    ]);
    if (!mounted.current) return;
    setRestaurants(restaurantResult.items);
    setGifts(giftResult.items);
    setSource(restaurantResult.source === "sheet" || giftResult.source === "sheet" ? "sheet" : "local");
    setLoading(false);
  }, []);

  useEffect(() => {
    mounted.current = true;
    reload();
    return () => {
      mounted.current = false;
    };
  }, [reload]);

  return (
    <DataContext.Provider value={{ restaurants, gifts, loading, source, reload }}>
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

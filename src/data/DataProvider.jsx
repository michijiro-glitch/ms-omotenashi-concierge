import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import localGifts from "../data/gifts.json";
import localRestaurants from "../data/restaurants.json";
import { loadGifts, loadRestaurants } from "../lib/loadData.js";

const DataContext = createContext(null);
const HAS_RESTAURANT_CSV = Boolean(import.meta.env.VITE_RESTAURANTS_CSV_URL);
const HAS_GIFT_CSV = Boolean(import.meta.env.VITE_GIFTS_CSV_URL);

export function DataProvider({ children }) {
  const [restaurants, setRestaurants] = useState(HAS_RESTAURANT_CSV ? [] : localRestaurants);
  const [gifts, setGifts] = useState(HAS_GIFT_CSV ? [] : localGifts);
  const [loading, setLoading] = useState(true);
  const [restaurantError, setRestaurantError] = useState(false);
  const [giftError, setGiftError] = useState(false);
  const mounted = useRef(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [restaurantResult, giftResult] = await Promise.all([
      loadRestaurants(localRestaurants),
      loadGifts(localGifts),
    ]);
    if (!mounted.current) return;

    if (restaurantResult.source !== "error") {
      setRestaurants(restaurantResult.items);
      setRestaurantError(false);
    } else {
      setRestaurantError(true);
    }

    if (giftResult.source !== "error") {
      setGifts(giftResult.items);
      setGiftError(false);
    } else {
      setGiftError(true);
    }

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
    <DataContext.Provider
      value={{ restaurants, gifts, loading, restaurantError, giftError, reload }}
    >
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

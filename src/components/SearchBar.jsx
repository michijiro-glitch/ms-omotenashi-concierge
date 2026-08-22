import { useEffect, useRef, useState } from "react";

export default function SearchBar({ label, placeholder, value, onChange }) {
  const composingRef = useRef(false);
  const focusedRef = useRef(false);
  const timerRef = useRef(null);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (focusedRef.current || composingRef.current) return;
    setDraft(value);
  }, [value]);

  function clearTimer() {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function commit(next) {
    setDraft(next);
    onChange(next);
  }

  return (
    <label className="search">
      <span className="sr-only">{label}</span>
      <input
        type="text"
        enterKeyHint="search"
        autoComplete="off"
        value={draft}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          if (composingRef.current || event.nativeEvent.isComposing) {
            clearTimer();
            return;
          }
          clearTimer();
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            if (composingRef.current) return;
            onChange(next);
          }, 500);
        }}
        onCompositionStart={() => {
          composingRef.current = true;
          clearTimer();
        }}
        onCompositionEnd={(event) => {
          composingRef.current = false;
          clearTimer();
          commit(event.currentTarget.value);
        }}
        onFocus={() => {
          focusedRef.current = true;
        }}
        onBlur={(event) => {
          focusedRef.current = false;
          composingRef.current = false;
          clearTimer();
          onChange(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          composingRef.current = false;
          clearTimer();
          onChange(event.currentTarget.value);
        }}
        placeholder={placeholder}
      />
    </label>
  );
}

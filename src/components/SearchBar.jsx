import { useEffect, useRef } from "react";

export default function SearchBar({ label, placeholder, value, onChange }) {
  const inputRef = useRef(null);
  const composingRef = useRef(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    if (document.activeElement === input) return;
    if (input.value !== (value ?? "")) input.value = value ?? "";
  }, [value]);

  function clearTimer() {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function commit(next) {
    clearTimer();
    onChange(next);
  }

  return (
    <label className="search">
      <span className="sr-only">{label}</span>
      <input
        ref={inputRef}
        type="text"
        enterKeyHint="search"
        autoComplete="off"
        defaultValue={value}
        placeholder={placeholder}
        onCompositionStart={() => {
          composingRef.current = true;
          clearTimer();
        }}
        onCompositionUpdate={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={(event) => {
          composingRef.current = false;
          commit(event.currentTarget.value);
        }}
        onInput={(event) => {
          if (composingRef.current || event.nativeEvent.isComposing) return;
          const next = event.currentTarget.value;
          clearTimer();
          timerRef.current = setTimeout(() => {
            timerRef.current = null;
            if (composingRef.current) return;
            onChange(next);
          }, 400);
        }}
        onBlur={(event) => {
          composingRef.current = false;
          commit(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return;
          composingRef.current = false;
          event.currentTarget.blur();
        }}
      />
    </label>
  );
}

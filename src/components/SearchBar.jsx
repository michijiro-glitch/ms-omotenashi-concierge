import { useEffect, useRef, useState } from "react";

export default function SearchBar({ label, placeholder, value, onChange }) {
  const composingRef = useRef(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!composingRef.current) setDraft(value);
  }, [value]);

  function commit(next) {
    setDraft(next);
    onChange(next);
  }

  return (
    <label className="search">
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={draft}
        onChange={(event) => {
          const next = event.target.value;
          setDraft(next);
          if (composingRef.current || event.nativeEvent.isComposing) return;
          onChange(next);
        }}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={(event) => {
          composingRef.current = false;
          commit(event.currentTarget.value);
        }}
        placeholder={placeholder}
      />
    </label>
  );
}

import { useState } from "react";
import { getEditToken, setEditToken } from "../lib/sheetWrite.js";

export default function EditGate({ children }) {
  const [token, setToken] = useState(getEditToken());
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  if (token) {
    return children(token);
  }

  return (
    <form
      className="edit-form"
      onSubmit={(event) => {
        event.preventDefault();
        const next = draft.trim();
        if (!next) {
          setError("合言葉を入力してください。");
          return;
        }
        setEditToken(next);
        setToken(next);
        setError("");
      }}
    >
      <p className="edit-note">合言葉が必要です。他人には教えないでください。</p>
      <label className="edit-field">
        <span>合言葉</span>
        <input
          type="password"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          autoComplete="current-password"
        />
      </label>
      {error ? <p className="edit-error">{error}</p> : null}
      <button className="edit-submit" type="submit">
        解除する
      </button>
    </form>
  );
}

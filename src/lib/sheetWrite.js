const TOKEN_KEY = "omotenashi-edit-token";

export function canEditInApp() {
  return Boolean(import.meta.env.VITE_EDIT_SCRIPT_URL);
}

export function getEditToken() {
  return sessionStorage.getItem(TOKEN_KEY) || "";
}

export function setEditToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearEditToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function postEdit(body) {
  const url = import.meta.env.VITE_EDIT_SCRIPT_URL;
  if (!url) {
    throw new Error("まだシートへ書き戻す接続がありません。");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("保存に失敗しました。ウェブアプリのURLと権限を確認してください。");
  }
  if (!payload.ok) {
    throw new Error(payload.error || "保存できませんでした。");
  }
  return payload;
}

export async function saveItem({ kind, id, fields, photos, token, action = "update" }) {
  return postEdit({ kind, id, fields, photos, token, action });
}

export async function saveChoicePick({ action, slug, type, id, token }) {
  return postEdit({ action, slug, type, id, token });
}

export async function loadChoicePicks() {
  const url = import.meta.env.VITE_EDIT_SCRIPT_URL;
  if (!url) return { picksBySlug: null, source: "local" };

  try {
    const joiner = url.includes("?") ? "&" : "?";
    const response = await fetch(`${url}${joiner}action=choices&_=${Date.now()}`);
    const payload = JSON.parse(await response.text());
    if (!payload?.ok || !payload.picks) return { picksBySlug: null, source: "error" };
    return { picksBySlug: payload.picks, source: "script" };
  } catch {
    return { picksBySlug: null, source: "error" };
  }
}

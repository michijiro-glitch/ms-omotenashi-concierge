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

export async function saveItem({ kind, id, fields, photos, token, action = "update" }) {
  const url = import.meta.env.VITE_EDIT_SCRIPT_URL;
  if (!url) {
    throw new Error("まだシートへ書き戻す接続がありません。");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ kind, id, fields, photos, token, action }),
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

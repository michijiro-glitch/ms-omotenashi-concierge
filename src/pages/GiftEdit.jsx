import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import EditGate from "../components/EditGate.jsx";
import PhotoEditor from "../components/PhotoEditor.jsx";
import { useData } from "../data/DataProvider.jsx";
import { GIFT_CATEGORIES, GIFT_RECIPIENTS, PRICE_RANGES, RATINGS } from "../lib/formOptions.js";
import { photosFromItem, photosToPayload } from "../lib/photos.js";
import { clearEditToken, saveItem } from "../lib/sheetWrite.js";

function Field({ label, children }) {
  return (
    <label className="edit-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function GiftEdit() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { gifts, loading, reload } = useData();
  const gift = gifts.find((item) => item.id === id);
  const listPath = { pathname: "/gifts", search: location.state?.listSearch ?? "" };

  if (loading) {
    return (
      <div className="page detail-page">
        <p className="empty">読み込み中…</p>
      </div>
    );
  }

  if (!gift) {
    return <Navigate to={listPath} replace />;
  }

  return (
    <div className="page detail-page">
      <Link className="back" to={`/gifts/${id}`} state={location.state}>
        ← 詳細に戻る
      </Link>
      <p className="eyebrow">直す</p>
      <h1 className="detail-name">{gift.name}</h1>
      <p className="edit-note">写真は外す・足すことができます。最大5枚です。</p>
      <EditGate>
        {(token) => (
          <GiftForm
            gift={gift}
            token={token}
            onSaved={async () => {
              await reload();
              navigate(`/gifts/${id}`, { state: location.state });
            }}
          />
        )}
      </EditGate>
    </div>
  );
}

function GiftForm({ gift, token, onSaved }) {
  const [fields, setFields] = useState({
    name: gift.name || "",
    brand: gift.brand || "",
    category: gift.category || "",
    priceRange: gift.priceRange || "",
    recipients: gift.recipients || [],
    keeping: gift.keeping || "",
    purchaseUrl: gift.purchaseUrl || "",
    recommend: gift.recommend || "",
    caution: gift.caution || "",
    mediaName: gift.mediaName || "",
    mediaUrl: gift.mediaUrl || "",
    wantToUseAgain: gift.wantToUseAgain ? String(gift.wantToUseAgain) : "",
  });
  const [photos, setPhotos] = useState(() => photosFromItem(gift));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function setField(key, value) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      className="edit-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        try {
          await saveItem({
            kind: "gift",
            id: gift.id,
            fields,
            photos: await photosToPayload(photos),
            token,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await onSaved();
        } catch (err) {
          if (String(err.message || "").includes("合言葉")) {
            clearEditToken();
          }
          setError(err.message || "保存できませんでした。");
          setSaving(false);
        }
      }}
    >
      <PhotoEditor items={photos} onChange={setPhotos} />
      <Field label="商品名">
        <input value={fields.name} onChange={(event) => setField("name", event.target.value)} required />
      </Field>
      <Field label="店名・ブランド">
        <input value={fields.brand} onChange={(event) => setField("brand", event.target.value)} />
      </Field>
      <Field label="カテゴリ">
        <select value={fields.category} onChange={(event) => setField("category", event.target.value)}>
          <option value="">未選択</option>
          {GIFT_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      <Field label="価格帯">
        <select value={fields.priceRange} onChange={(event) => setField("priceRange", event.target.value)}>
          <option value="">未選択</option>
          {PRICE_RANGES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      <div className="edit-field">
        <span>向いている相手・用途</span>
        <div className="edit-checks">
          {GIFT_RECIPIENTS.map((option) => (
            <label key={option} className="edit-check">
              <input
                type="checkbox"
                checked={fields.recipients.includes(option)}
                onChange={(event) => {
                  if (event.target.checked) setField("recipients", [...fields.recipients, option]);
                  else setField("recipients", fields.recipients.filter((item) => item !== option));
                }}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      <Field label="日持ち・保存">
        <input value={fields.keeping} onChange={(event) => setField("keeping", event.target.value)} />
      </Field>
      <Field label="購入先URL">
        <input value={fields.purchaseUrl} onChange={(event) => setField("purchaseUrl", event.target.value)} />
      </Field>
      <Field label="おすすめポイント">
        <textarea rows="4" value={fields.recommend} onChange={(event) => setField("recommend", event.target.value)} />
      </Field>
      <Field label="注意点・メモ">
        <textarea rows="3" value={fields.caution} onChange={(event) => setField("caution", event.target.value)} />
      </Field>
      <Field label="メディア掲載名">
        <input value={fields.mediaName} onChange={(event) => setField("mediaName", event.target.value)} />
      </Field>
      <Field label="メディア掲載URL">
        <input value={fields.mediaUrl} onChange={(event) => setField("mediaUrl", event.target.value)} />
      </Field>
      <Field label="また使いたい度">
        <select value={fields.wantToUseAgain} onChange={(event) => setField("wantToUseAgain", event.target.value)}>
          <option value="">未選択</option>
          {RATINGS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      {error ? <p className="edit-error">{error}</p> : null}
      <button className="edit-submit" type="submit" disabled={saving}>
        {saving ? "保存しています…" : "保存する"}
      </button>
    </form>
  );
}

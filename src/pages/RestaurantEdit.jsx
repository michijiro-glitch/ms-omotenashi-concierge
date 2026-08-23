import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import EditGate from "../components/EditGate.jsx";
import PageMeta from "../components/PageMeta.jsx";
import PhotoEditor from "../components/PhotoEditor.jsx";
import { useData } from "../data/DataProvider.jsx";
import {
  DOG_POLICIES,
  FORMALITY,
  GENRES,
  MOODS,
  PRICE_RANGES,
  RATINGS,
  REGIONS,
  SCENES,
  STATUSES,
  TOKYO_AREAS,
  statusLabel,
  toDateInput,
} from "../lib/formOptions.js";
import { photosFromItem, photosToPayload } from "../lib/photos.js";
import { fullTitle } from "../lib/pageMeta.js";
import { clearEditToken, saveItem } from "../lib/sheetWrite.js";

function Field({ label, children }) {
  return (
    <label className="edit-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function CheckGroup({ options, value, onChange }) {
  return (
    <div className="edit-checks">
      {options.map((option) => (
        <label key={option} className="edit-check">
          <input
            type="checkbox"
            checked={value.includes(option)}
            onChange={(event) => {
              if (event.target.checked) onChange([...value, option]);
              else onChange(value.filter((item) => item !== option));
            }}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

export default function RestaurantEdit() {
  const { id } = useParams();
  const isNew = !id;
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurants, loading, reload } = useData();
  const restaurant = isNew ? null : restaurants.find((item) => item.id === id);
  const listPath = { pathname: "/restaurants", search: location.state?.listSearch ?? "" };

  if (!isNew && loading) {
    return (
      <div className="page detail-page edit-page">
        <PageMeta title={fullTitle("直す")} description="編集画面です。" noindex />
        <p className="empty">読み込み中…</p>
      </div>
    );
  }

  if (!isNew && !restaurant) {
    return <Navigate to={listPath} replace />;
  }

  return (
    <div className="page detail-page edit-page">
      <PageMeta
        title={fullTitle(isNew ? "レストランを追加" : `${restaurant.name}を直す`)}
        description="編集画面です。公開サイトでは使いません。"
        noindex
      />
      <Link className="back" to={isNew ? listPath : `/restaurants/${id}`} state={location.state}>
        {isNew ? "← 一覧に戻る" : "← 詳細に戻る"}
      </Link>
      <p className="eyebrow">{isNew ? "新規登録" : "直す"}</p>
      <h1 className="detail-name">{isNew ? "レストランを追加" : restaurant.name}</h1>
      <p className="edit-note">写真は外す・足すことができます。最大5枚です。</p>
      <EditGate>
        {(token) => (
          <RestaurantForm
            restaurant={restaurant}
            isNew={isNew}
            token={token}
            onSaved={async (savedId) => {
              await reload();
              navigate(`/restaurants/${savedId}`, { state: location.state });
            }}
          />
        )}
      </EditGate>
    </div>
  );
}

function RestaurantForm({ restaurant, isNew, token, onSaved }) {
  const [fields, setFields] = useState({
    name: restaurant?.name || "",
    status: restaurant?.status || "行ってみたい",
    region: restaurant?.region || "",
    tokyoArea: restaurant?.tokyoArea || "",
    otherArea: restaurant?.otherArea || "",
    genre: restaurant?.genre || "",
    priceRange: restaurant?.priceRange || "",
    formality: restaurant?.formality || "",
    scenes: restaurant?.scenes || [],
    moods: restaurant?.moods || [],
    dogPolicy: restaurant?.dogPolicy || "要確認",
    recommend: restaurant?.recommend || "",
    caution: restaurant?.caution || "",
    oneLiner: restaurant?.oneLiner || "",
    memo: restaurant?.memo || "",
    lastVisit: toDateInput(restaurant?.lastVisit),
    officialUrl: restaurant?.officialUrl || "",
    tabelogUrl: restaurant?.tabelogUrl || "",
    reserveUrl: restaurant?.reserveUrl || "",
    mediaName: restaurant?.mediaName || "",
    mediaUrl: restaurant?.mediaUrl || "",
    wantToGoAgain: restaurant?.wantToGoAgain ? String(restaurant.wantToGoAgain) : "",
  });
  const [photos, setPhotos] = useState(() => photosFromItem(restaurant || {}));
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
          const payload = await saveItem({
            kind: "restaurant",
            action: isNew ? "create" : "update",
            id: restaurant?.id || "",
            fields,
            photos: await photosToPayload(photos),
            token,
          });
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await onSaved(payload.id || restaurant?.id);
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
      <Field label="店名">
        <input value={fields.name} onChange={(event) => setField("name", event.target.value)} required />
      </Field>
      <Field label="ステータス">
        <select value={fields.status} onChange={(event) => setField("status", event.target.value)}>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {statusLabel(item)}
            </option>
          ))}
        </select>
      </Field>
      <Field label="地域区分">
        <select value={fields.region} onChange={(event) => setField("region", event.target.value)}>
          <option value="">未選択</option>
          {REGIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      <Field label="都内エリア">
        <select value={fields.tokyoArea} onChange={(event) => setField("tokyoArea", event.target.value)}>
          <option value="">未選択</option>
          {TOKYO_AREAS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      <Field label="地方・海外エリア">
        <input value={fields.otherArea} onChange={(event) => setField("otherArea", event.target.value)} />
      </Field>
      <Field label="ジャンル">
        <select value={fields.genre} onChange={(event) => setField("genre", event.target.value)}>
          <option value="">未選択</option>
          {GENRES.map((item) => (
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
      <Field label="フォーマル度">
        <select value={fields.formality} onChange={(event) => setField("formality", event.target.value)}>
          <option value="">未選択</option>
          {FORMALITY.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      <div className="edit-field">
        <span>利用シーン</span>
        <CheckGroup options={SCENES} value={fields.scenes} onChange={(value) => setField("scenes", value)} />
      </div>
      <div className="edit-field">
        <span>雰囲気</span>
        <CheckGroup options={MOODS} value={fields.moods} onChange={(value) => setField("moods", value)} />
      </div>
      <Field label="犬連れ">
        <select value={fields.dogPolicy} onChange={(event) => setField("dogPolicy", event.target.value)}>
          {DOG_POLICIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      <Field label="おすすめポイント">
        <textarea rows="4" value={fields.recommend} onChange={(event) => setField("recommend", event.target.value)} />
      </Field>
      <Field label="注意点">
        <textarea rows="3" value={fields.caution} onChange={(event) => setField("caution", event.target.value)} />
      </Field>
      <Field label="ひとこと評価">
        <input value={fields.oneLiner} onChange={(event) => setField("oneLiner", event.target.value)} />
      </Field>
      <Field label="自由メモ">
        <textarea rows="3" value={fields.memo} onChange={(event) => setField("memo", event.target.value)} />
      </Field>
      <Field label="最終訪問日">
        <input type="date" value={fields.lastVisit} onChange={(event) => setField("lastVisit", event.target.value)} />
      </Field>
      <Field label="公式HP URL">
        <input value={fields.officialUrl} onChange={(event) => setField("officialUrl", event.target.value)} />
      </Field>
      <Field label="食べログURL">
        <input value={fields.tabelogUrl} onChange={(event) => setField("tabelogUrl", event.target.value)} />
      </Field>
      <Field label="予約URL">
        <input value={fields.reserveUrl} onChange={(event) => setField("reserveUrl", event.target.value)} />
      </Field>
      <Field label="メディア掲載名">
        <input value={fields.mediaName} onChange={(event) => setField("mediaName", event.target.value)} />
      </Field>
      <Field label="メディア掲載URL">
        <input value={fields.mediaUrl} onChange={(event) => setField("mediaUrl", event.target.value)} />
      </Field>
      <Field label="また行きたい度">
        <select value={fields.wantToGoAgain} onChange={(event) => setField("wantToGoAgain", event.target.value)}>
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
        {saving ? "保存しています…" : isNew ? "登録する" : "保存する"}
      </button>
    </form>
  );
}

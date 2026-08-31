import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import EditGate from "../components/EditGate.jsx";
import PageMeta from "../components/PageMeta.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useData } from "../data/DataProvider.jsx";
import { resolvePicks } from "../lib/choices.js";
import { areaLabel } from "../lib/restaurants.js";
import { canEditInApp, clearEditToken, saveChoicePick } from "../lib/sheetWrite.js";
import { fullTitle } from "../lib/pageMeta.js";

export default function ChoiceEdit() {
  return (
    <div className="page edit-page">
      <PageMeta title={fullTitle("M's Choice の掲載")} description="自分用の特集編集画面です。" noindex />
      <Link className="back" to="/edit">
        ← 登録・編集に戻る
      </Link>
      <p className="eyebrow">自分用</p>
      <h1 className="detail-name">M's Choice の掲載</h1>
      <p className="edit-note">特集に載せる店やギフトを、登録済みのデータから選びます。名前や写真はシート側の情報を使います。</p>
      {canEditInApp() ? (
        <EditGate>{(token) => <ChoicePickEditor token={token} />}</EditGate>
      ) : (
        <p className="empty">このパソコンの編集用（npm run edit）で開いてください。</p>
      )}
      <SiteFooter />
    </div>
  );
}

function itemLabel(item, type) {
  if (!item) return "";
  if (type === "gift") return `${item.name}（${item.brand || "ギフト"}）`;
  return `${item.name}（${areaLabel(item) || "レストラン"}）`;
}

function ChoicePickEditor({ token }) {
  const { restaurants, gifts, choices, loading, reload } = useData();
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const catalogs = useMemo(
    () => ({
      restaurant: [...restaurants].sort((a, b) => a.name.localeCompare(b.name, "ja")),
      gift: [...gifts].sort((a, b) => a.name.localeCompare(b.name, "ja")),
    }),
    [restaurants, gifts],
  );

  async function run(action, slug, type, id) {
    setBusy(`${action}:${slug}:${id}`);
    setError("");
    try {
      await saveChoicePick({ action, slug, type, id, token });
      await reload();
      if (action === "addChoicePick") {
        setDrafts((current) => ({ ...current, [slug]: "" }));
      }
    } catch (err) {
      if (String(err.message || "").includes("合言葉")) clearEditToken();
      setError(err.message || "保存できませんでした。");
    } finally {
      setBusy("");
    }
  }

  if (loading && restaurants.length === 0 && gifts.length === 0) {
    return <p className="empty">読み込み中…</p>;
  }

  return (
    <div className="choice-edit-list">
      {choices.map((choice) => {
        const type = choice.kind === "gift" ? "gift" : "restaurant";
        const resolved = resolvePicks(choice, restaurants, gifts);
        const selectedIds = new Set((choice.picks || []).map((pick) => pick.id));
        const options = catalogs[type].filter((item) => !selectedIds.has(item.id));
        const draft = drafts[choice.slug] || "";

        return (
          <section key={choice.slug} className="choice-edit-block">
            <h2>{choice.titleJa}</h2>
            <p className="choice-edit-kicker">{choice.titleEn}</p>
            {resolved.length ? (
              <ul className="choice-edit-picks">
                {resolved.map((pick) => (
                  <li key={pick.id}>
                    <span>{itemLabel(pick.item, pick.type)}</span>
                    <button
                      type="button"
                      className="choice-edit-remove"
                      disabled={Boolean(busy)}
                      onClick={() => run("removeChoicePick", choice.slug, pick.type, pick.id)}
                    >
                      外す
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">まだ掲載がありません。</p>
            )}
            <div className="choice-edit-add">
              <select
                value={draft}
                onChange={(event) => setDrafts((current) => ({ ...current, [choice.slug]: event.target.value }))}
                disabled={Boolean(busy) || options.length === 0}
              >
                <option value="">{options.length ? "追加する店・品を選ぶ" : "追加できるものがありません"}</option>
                {options.map((item) => (
                  <option key={item.id} value={item.id}>
                    {itemLabel(item, type)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="edit-submit"
                disabled={!draft || Boolean(busy)}
                onClick={() => run("addChoicePick", choice.slug, type, draft)}
              >
                追加する
              </button>
            </div>
          </section>
        );
      })}
      {error ? <p className="edit-error">{error}</p> : null}
    </div>
  );
}

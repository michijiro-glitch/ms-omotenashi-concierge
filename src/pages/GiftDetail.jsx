import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import Facts from "../components/Facts.jsx";
import PageMeta from "../components/PageMeta.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useData } from "../data/DataProvider.jsx";
import { clipMeta, DESCRIPTIONS, fullTitle } from "../lib/pageMeta.js";
import { canEditInApp } from "../lib/sheetWrite.js";
import { photoSrc } from "../lib/restaurants.js";

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="detail-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function GiftDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { gifts, loading } = useData();
  const gift = gifts.find((item) => item.id === id);
  const listPath = { pathname: "/gifts", search: location.state?.listSearch ?? "" };

  if (loading) {
    return (
      <div className="page detail-page">
        <PageMeta title={fullTitle("手土産・お取り寄せ")} description={DESCRIPTIONS.gifts} />
        <p className="empty">読み込み中…</p>
        <SiteFooter />
      </div>
    );
  }

  if (!gift) {
    return <Navigate to={listPath} replace />;
  }

  const photos = (gift.photos || []).map(photoSrc).filter(Boolean);
  const description =
    clipMeta(
      [gift.recommend, [gift.brand, gift.category, gift.priceRange].filter(Boolean).join("、")].filter(Boolean).join(" "),
    ) || `${gift.name}の手土産・お取り寄せ詳細。`;

  return (
    <div className="page detail-page">
      <PageMeta title={fullTitle(gift.name, "手土産・お取り寄せ")} description={description} />
      <Link className="back" to={listPath}>
        ← 一覧に戻る
      </Link>
      {canEditInApp() ? (
        <Link className="edit-link" to={`/gifts/${id}/edit`} state={location.state}>
          直す
        </Link>
      ) : null}

      <div className="hero">
        {photos[0] ? (
          <img src={photos[0]} alt={gift.name} />
        ) : (
          <div className="hero-placeholder">
            <span>{gift.brand}</span>
          </div>
        )}
      </div>

      {photos.length > 1 ? (
        <ul className="photo-thumbs">
          {photos.slice(1).map((src, index) => (
            <li key={src}>
              <img src={src} alt={`${gift.name}の写真${index + 2}`} />
            </li>
          ))}
        </ul>
      ) : null}

      <p className="eyebrow">手土産・お取り寄せ</p>
      <h1 className="detail-name">{gift.name}</h1>
      <Facts
        items={[
          { label: "店名・ブランド", value: gift.brand },
          { label: "カテゴリ", value: gift.category },
          { label: "価格帯", value: gift.priceRange },
        ]}
      />

      {gift.wantToUseAgain ? (
        <p className="stars" aria-label={`また使いたい度 ${gift.wantToUseAgain}`}>
          {"★".repeat(gift.wantToUseAgain)}
          <span className="stars-empty">{"★".repeat(5 - gift.wantToUseAgain)}</span>
        </p>
      ) : null}

      <Section title="おすすめポイント">{gift.recommend ? <p>{gift.recommend}</p> : null}</Section>
      <Section title="注意点・メモ">{gift.caution ? <p>{gift.caution}</p> : null}</Section>
      <Section title="向いている相手・用途">
        {gift.recipients.length ? (
          <ul className="tags">
            {gift.recipients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </Section>
      <Section title="日持ち・保存">{gift.keeping ? <p>{gift.keeping}</p> : null}</Section>
      <Section title="メディア掲載">
        {gift.mediaName ? (
          gift.mediaUrl ? (
            <p>
              <a href={gift.mediaUrl} target="_blank" rel="noreferrer">
                {gift.mediaName}
              </a>
            </p>
          ) : (
            <p>{gift.mediaName}</p>
          )
        ) : null}
      </Section>
      <Section title="購入先">
        {gift.purchaseUrl ? (
          <p>
            <a href={gift.purchaseUrl} target="_blank" rel="noreferrer">
              {gift.brand}の公式サイト
            </a>
          </p>
        ) : null}
      </Section>
      <SiteFooter />
    </div>
  );
}

import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useData } from "../data/DataProvider.jsx";
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
        <p className="empty">読み込み中…</p>
      </div>
    );
  }

  if (!gift) {
    return <Navigate to={listPath} replace />;
  }

  const photos = (gift.photos || []).map(photoSrc).filter(Boolean);

  return (
    <div className="page detail-page">
      <Link className="back" to={listPath}>
        ← 一覧に戻る
      </Link>

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
          {photos.slice(1).map((src) => (
            <li key={src}>
              <img src={src} alt="" />
            </li>
          ))}
        </ul>
      ) : null}

      <p className="eyebrow">手土産・お取り寄せ</p>
      <h1 className="detail-name">{gift.name}</h1>
      <p className="card-meta">
        {gift.brand}
        <span className="dot">·</span>
        {gift.category}
        <span className="dot">·</span>
        {gift.priceRange}
      </p>

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
      <Section title="購入先">
        {gift.purchaseUrl ? (
          <p>
            <a href={gift.purchaseUrl} target="_blank" rel="noreferrer">
              {gift.brand}の公式サイト
            </a>
          </p>
        ) : null}
      </Section>
    </div>
  );
}

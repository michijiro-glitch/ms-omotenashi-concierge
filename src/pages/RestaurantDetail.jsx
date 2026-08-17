import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { useData } from "../data/DataProvider.jsx";
import { areaLabel, cardTags, isDogOk, photoSrc } from "../lib/restaurants.js";

function Section({ title, children }) {
  if (!children) return null;
  return (
    <section className="detail-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { restaurants, loading } = useData();
  const restaurant = restaurants.find((item) => item.id === id);
  const listPath = { pathname: "/restaurants", search: location.state?.listSearch ?? "" };

  if (loading) {
    return (
      <div className="page detail-page">
        <p className="empty">読み込み中…</p>
      </div>
    );
  }

  if (!restaurant) {
    return <Navigate to={listPath} replace />;
  }

  const visited = restaurant.status === "行ったことがある";
  const photos = (restaurant.photos || []).map(photoSrc).filter(Boolean);
  const area = areaLabel(restaurant);

  return (
    <div className="page detail-page">
      <Link className="back" to={listPath}>
        ← 一覧に戻る
      </Link>

      <div className="hero">
        {photos[0] ? (
          <img src={photos[0]} alt={restaurant.name} />
        ) : (
          <div className="hero-placeholder">
            <span>{area}</span>
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

      <p className="eyebrow">{visited ? "行ったことがある" : "行ってみたい"}</p>
      <h1 className="detail-name">{restaurant.name}</h1>
      <p className="card-meta">
        {area}
        <span className="dot">·</span>
        {restaurant.genre}
        <span className="dot">·</span>
        {restaurant.priceRange}
      </p>

      <ul className="tags">
        {cardTags(restaurant).map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      {visited && restaurant.wantToGoAgain ? (
        <p className="stars" aria-label={`また行きたい度 ${restaurant.wantToGoAgain}`}>
          {"★".repeat(restaurant.wantToGoAgain)}
          <span className="stars-empty">{"★".repeat(5 - restaurant.wantToGoAgain)}</span>
        </p>
      ) : null}

      <Section title="私のコメント">
        {restaurant.oneLiner ? <p className="lead-comment">{restaurant.oneLiner}</p> : null}
      </Section>

      <Section title="おすすめポイント">
        {restaurant.recommend ? <p>{restaurant.recommend}</p> : null}
      </Section>

      <Section title="注意点">{restaurant.caution ? <p>{restaurant.caution}</p> : null}</Section>

      <Section title="利用シーン">
        {restaurant.scenes.length ? (
          <ul className="tags">
            {restaurant.scenes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </Section>

      <Section title="雰囲気">
        {restaurant.moods.length ? (
          <ul className="tags">
            {restaurant.moods.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
      </Section>

      <Section title="犬連れ">
        {isDogOk(restaurant) ? <p>{restaurant.dogPolicy}</p> : null}
      </Section>

      <Section title="メモ">{restaurant.memo ? <p>{restaurant.memo}</p> : null}</Section>

      <Section title="外部リンク">
        {restaurant.officialUrl ||
        restaurant.tabelogUrl ||
        restaurant.reserveUrl ||
        (restaurant.mediaName && restaurant.mediaUrl) ? (
          <ul className="links">
            {restaurant.officialUrl ? (
              <li>
                <a href={restaurant.officialUrl} target="_blank" rel="noreferrer">
                  公式HP
                </a>
              </li>
            ) : null}
            {restaurant.tabelogUrl ? (
              <li>
                <a href={restaurant.tabelogUrl} target="_blank" rel="noreferrer">
                  食べログ
                </a>
              </li>
            ) : null}
            {restaurant.reserveUrl ? (
              <li>
                <a href={restaurant.reserveUrl} target="_blank" rel="noreferrer">
                  予約
                </a>
              </li>
            ) : null}
            {restaurant.mediaName && restaurant.mediaUrl ? (
              <li>
                <a href={restaurant.mediaUrl} target="_blank" rel="noreferrer">
                  {restaurant.mediaName}
                </a>
              </li>
            ) : null}
          </ul>
        ) : null}
      </Section>
    </div>
  );
}

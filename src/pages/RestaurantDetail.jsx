import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import Facts from "../components/Facts.jsx";
import PageMeta from "../components/PageMeta.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useData } from "../data/DataProvider.jsx";
import { statusLabel } from "../lib/formOptions.js";
import { clipMeta, DESCRIPTIONS, fullTitle } from "../lib/pageMeta.js";
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

function MediaSection({ name, url }) {
  if (!name) return null;
  return (
    <Section title="メディア掲載">
      {url ? (
        <p>
          <a href={url} target="_blank" rel="noreferrer">
            {name}
          </a>
        </p>
      ) : (
        <p>{name}</p>
      )}
    </Section>
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
        <PageMeta title={fullTitle("レストラン")} description={DESCRIPTIONS.restaurants} />
        <p className="empty">読み込み中…</p>
        <SiteFooter />
      </div>
    );
  }

  if (!restaurant) {
    return <Navigate to={listPath} replace />;
  }

  const visited = restaurant.status === "行ったことがある";
  const photos = (restaurant.photos || []).map(photoSrc).filter(Boolean);
  const area = areaLabel(restaurant);
  const status = statusLabel(restaurant.status);
  const description =
    clipMeta(
      [restaurant.oneLiner, restaurant.recommend, [area, restaurant.genre, restaurant.priceRange].filter(Boolean).join("、")]
        .filter(Boolean)
        .join(" "),
    ) || `${restaurant.name}のレストラン詳細。`;

  return (
    <div className="page detail-page">
      <PageMeta title={fullTitle(restaurant.name, "レストラン")} description={description} />
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
          {photos.slice(1).map((src, index) => (
            <li key={src}>
              <img src={src} alt={`${restaurant.name}の写真${index + 2}`} />
            </li>
          ))}
        </ul>
      ) : null}

      <p className="eyebrow">{status}</p>
      <h1 className="detail-name">{restaurant.name}</h1>
      <Facts
        items={[
          { label: "エリア", value: area },
          { label: "ジャンル", value: restaurant.genre },
          { label: "価格帯", value: restaurant.priceRange },
          { label: "M's Visit / M's Wishlist", value: status },
        ]}
      />

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

      <MediaSection name={restaurant.mediaName} url={restaurant.mediaUrl} />

      <Section title="外部リンク">
        {restaurant.officialUrl || restaurant.tabelogUrl || restaurant.reserveUrl ? (
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
          </ul>
        ) : null}
      </Section>
      <SiteFooter />
    </div>
  );
}

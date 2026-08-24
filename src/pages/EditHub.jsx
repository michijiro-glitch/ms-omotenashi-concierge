import { Link } from "react-router-dom";
import EditGate from "../components/EditGate.jsx";
import GiftCard from "../components/GiftCard.jsx";
import PageMeta from "../components/PageMeta.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { useData } from "../data/DataProvider.jsx";
import { fullTitle } from "../lib/pageMeta.js";

export default function EditHub() {
  const { restaurants, gifts, loading } = useData();

  return (
    <div className="page edit-page">
      <PageMeta title={fullTitle("登録・編集")} description="自分用の登録・編集画面です。" noindex />
      <Link className="back" to="/">
        ← トップ
      </Link>
      <p className="eyebrow">自分用</p>
      <h1 className="detail-name">登録・編集</h1>
      <EditGate>
        {() => (
          <>
            <p className="edit-note">合言葉が必要です。他人には教えないでください。</p>
            <nav className="edit-hub-nav" aria-label="登録する種類">
              <Link className="choice-card" to="/edit/restaurants/new">
                <span className="choice-kicker">Restaurant</span>
                <h2>レストランを追加</h2>
                <span className="choice-note">店を新規登録する</span>
              </Link>
              <Link className="choice-card" to="/edit/gifts/new">
                <span className="choice-kicker">Gift</span>
                <h2>手土産を追加</h2>
                <span className="choice-note">贈り物を新規登録する</span>
              </Link>
            </nav>
            {loading ? (
              <p className="empty">読み込み中…</p>
            ) : (
              <>
                <section className="edit-hub-existing" aria-label="レストランを直す">
                  <h2>レストランを直す</h2>
                  {restaurants.length ? (
                    <div className="card-grid">
                      {restaurants.map((restaurant) => (
                        <RestaurantCard
                          key={restaurant.id}
                          restaurant={restaurant}
                          to={`/edit/restaurants/${restaurant.id}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="empty">まだ登録がありません。</p>
                  )}
                </section>
                <section className="edit-hub-existing" aria-label="手土産を直す">
                  <h2>手土産を直す</h2>
                  {gifts.length ? (
                    <div className="card-grid">
                      {gifts.map((gift) => (
                        <GiftCard key={gift.id} gift={gift} to={`/edit/gifts/${gift.id}`} />
                      ))}
                    </div>
                  ) : (
                    <p className="empty">まだ登録がありません。</p>
                  )}
                </section>
              </>
            )}
          </>
        )}
      </EditGate>
      <SiteFooter />
    </div>
  );
}

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page home-page">
      <header className="site-header">
        <h1>
          <img
            className="brand-logo"
            src="/logo.png?v=3"
            alt="M's Omotenashi Concierge"
          />
        </h1>
        <p className="brand-note">
          長年出版社で営業として働いてきた私が実際に食べたもの、買ったもの、いつか行ってみたい場所をご紹介しています。
        </p>
      </header>

      <nav className="choice-grid" aria-label="カテゴリを選ぶ">
        <Link className="choice-card" to="/restaurants">
          <span className="choice-kicker">Restaurant</span>
          <strong>レストラン</strong>
          <span className="choice-note">お店を探す</span>
        </Link>
        <Link className="choice-card" to="/gifts">
          <span className="choice-kicker">Gift</span>
          <strong>手土産・お取り寄せ</strong>
          <span className="choice-note">贈り物や取り寄せを探す</span>
        </Link>
      </nav>
    </div>
  );
}

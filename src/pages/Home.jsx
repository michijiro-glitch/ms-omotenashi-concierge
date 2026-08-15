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
        <div className="brand-note">
          <p>長年、仕事やプライベートで数多くの会食や食の場を経験してきました。</p>
          <p>
            実際に訪れてよかった店、美味しかったもの、いつか訪れたい店、
            <br />
            そして贈って喜ばれた手土産、頂いてうれしかった品。
          </p>
          <p>私自身の経験と選択眼で集めた、食とおもてなしのパーソナル・コンシェルジュです。</p>
        </div>
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

import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { DESCRIPTIONS, SITE_NAME } from "../lib/pageMeta.js";

export default function Home() {
  return (
    <div className="page home-page">
      <PageMeta title={SITE_NAME} description={DESCRIPTIONS.home} />
      <div className="home-hero">
        <header className="site-header">
          <h1>
            <img
              className="brand-logo"
              src={`${import.meta.env.BASE_URL}logo.png?v=3`}
              alt=""
            />
            <span className="sr-only">{SITE_NAME}</span>
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
            <h2>レストラン</h2>
            <span className="choice-note">お店を探す</span>
          </Link>
          <Link className="choice-card" to="/gifts">
            <span className="choice-kicker">Gift</span>
            <h2>手土産・お取り寄せ</h2>
            <span className="choice-note">贈り物や取り寄せを探す</span>
          </Link>
        </nav>
      </div>

      <section className="home-about" aria-labelledby="home-about-heading">
        <h2 id="home-about-heading">About M</h2>
        <p>出版社の広告営業として、数多くの会食を経験してきました。</p>
        <p>私自身の経験と選択眼で集めた、食とおもてなしのパーソナル・コンシェルジュです。</p>
        <Link className="home-about-link" to="/about">
          About Mを読む →
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}

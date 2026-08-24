import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { DESCRIPTIONS, SITE_NAME } from "../lib/pageMeta.js";

function GoldRule() {
  return <div className="home-gold-rule" aria-hidden="true" />;
}

function ForkIcon() {
  return (
    <svg className="home-choice-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.5 3.5v6.2c0 1.2.8 2.1 1.8 2.3V20.5M7.5 3.5c0 2 .1 3.8.1 6.2M5.6 3.5v4.4c0 1.5.8 2.4 1.9 2.4M9.4 3.5v4.4c0 1.5-.8 2.4-1.9 2.4M15.8 3.5c1.6 0 2.7 1.4 2.7 3.4 0 1.6-.8 2.7-2 3.1V20.5M15.8 3.5V10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg className="home-choice-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4.5" y="10" width="15" height="10.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 14.2h15M12 10v10.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M12 10c-1.8-3.4-5.3-3.6-5.8-1.6-.4 1.6 1.6 2.6 5.8 1.6ZM12 10c1.8-3.4 5.3-3.6 5.8-1.6.4 1.6-1.6 2.6-5.8 1.6Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="home-choice-arrow" viewBox="0 0 36 8" fill="none" aria-hidden="true">
      <path d="M1 4h32M29.5 1.2 34 4l-4.5 2.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LeafAccent() {
  return (
    <svg className="home-choice-leaf" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M40 40c-8-2-16-8-18-18 8 2 16 8 18 18Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M28 36c-6-4-10-12-10-18 6 4 10 12 10 18Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d="M36 32c-4-8-4-14-2-20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const img = (file) => `${import.meta.env.BASE_URL}images/home/${file}`;

  return (
    <div className="page home-page">
      <PageMeta title={SITE_NAME} description={DESCRIPTIONS.home} />

      <header className="home-header">
        <h1>
          <img className="home-logo" src={`${import.meta.env.BASE_URL}logo.png?v=3`} alt="" />
          <span className="sr-only">{SITE_NAME}</span>
        </h1>
        <GoldRule />
        <p className="home-catch">
          出版社の現場で培った目利きで選ぶ、
          <br />
          レストランとギフトのパーソナルガイド
        </p>
        <p className="home-sub">
          実際に訪れてよかった店、行ってみたい店、
          <br />
          贈って喜ばれた手土産を、M自身の視点でセレクト。
        </p>
      </header>

      <nav className="home-choice-grid" aria-label="カテゴリを選ぶ">
        <Link className="home-choice-card" to="/restaurants">
          <span className="home-choice-visual">
            <img src={img("home-restaurant.png")} alt="" />
          </span>
          <span className="home-choice-body">
            <ForkIcon />
            <span className="home-choice-title">Restaurant</span>
            <span className="home-choice-diamond" aria-hidden="true" />
            <span className="home-choice-cta">レストランを探す</span>
            <ArrowIcon />
          </span>
          <LeafAccent />
        </Link>

        <Link className="home-choice-card" to="/gifts">
          <span className="home-choice-visual">
            <img src={img("home-gift.png")} alt="" />
          </span>
          <span className="home-choice-body">
            <GiftIcon />
            <span className="home-choice-title">Gift</span>
            <span className="home-choice-diamond" aria-hidden="true" />
            <span className="home-choice-cta">手土産を探す</span>
            <ArrowIcon />
          </span>
          <LeafAccent />
        </Link>
      </nav>

      <section className="home-about" aria-labelledby="home-about-heading">
        <GoldRule />
        <p id="home-about-heading" className="home-about-lead">
          なぜ、このサービスをつくったのか
        </p>
        <Link className="home-about-link" to="/about">
          About M <span aria-hidden="true">→</span>
        </Link>
        <GoldRule />
      </section>

      <SiteFooter variant="home" />
    </div>
  );
}

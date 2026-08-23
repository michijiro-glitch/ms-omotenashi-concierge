import { useState } from "react";
import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { DESCRIPTIONS, SITE_NAME, fullTitle } from "../lib/pageMeta.js";

function Illust({ file, alt, className }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <img
      className={className}
      src={`${import.meta.env.BASE_URL}images/about/${file}?v=18`}
      alt={alt}
      onError={() => setHidden(true)}
    />
  );
}

function Heading({ id, children, icon }) {
  return (
    <h2 id={id} className="about-heading">
      {icon ? <Illust file={icon} alt="" className="about-heading-icon" /> : null}
      <span>{children}</span>
    </h2>
  );
}

export default function About() {
  return (
    <div className="page about-page">
      <PageMeta title={fullTitle("About M")} description={DESCRIPTIONS.about} />

      <header className="about-brand">
        <Link to="/" className="about-brand-link">
          <img className="about-brand-logo" src={`${import.meta.env.BASE_URL}logo.png?v=3`} alt="" />
          <span className="sr-only">{SITE_NAME}</span>
        </Link>
        <Link to="/" className="about-home-link">
          トップに戻る
        </Link>
      </header>

      <header className="about-hero">
        <h1>About M</h1>
        <div className="about-title-rule" aria-hidden="true" />
        <div className="about-hero-grid">
          <div className="about-prose">
            <p>出版社の広告営業として、数多くの会食を経験してきました。</p>
            <p>
              フォーマルからカジュアルまで、お客様のお好みや会の趣旨に合わせてお店を選び、お招きいただいたお店が素敵だった時にはリストに残しました。
            </p>
            <p>大好きなワインをもっと深く知りたくて、ワインエキスパートの資格も取りました。</p>
            <p>
              また、お付き合いの中で、手土産をご用意することも、頂くことも多かったので、贈って喜ばれた手土産、頂いてうれしかった品もリストにしています。
            </p>
            <p>
              手土産だけでなく、お取り寄せのおすすめ品も加えています。ホームパーティの際にもお役に立つと思います。
            </p>
            <p>私自身の経験と選択眼で集めた、食とおもてなしのパーソナル・コンシェルジュです。</p>
          </div>
          <figure className="about-hero-visual">
            <Illust
              file="about-intro-terrace.jpg"
              alt="トイプードルとテラス席"
              className="about-illustration"
            />
          </figure>
        </div>
      </header>

      <section className="about-section" aria-labelledby="about-why">
        <Heading id="about-why">なぜ、このサービスをつくったのか</Heading>
        <div className="about-prose about-prose-center">
          <p>
            これまで、仕事でもプライベートでも「どこか良いお店を知らない？」「この方への手土産、何がいいと思う？」と聞かれることがよくありました。
          </p>
          <p>
            そのたびに、頭の中にある記憶をたどりながら、相手や目的、場所、予算、その日の雰囲気に合いそうな店や品を選んできました。自分の中に蓄積してきた「この場面ならここ」「この相手ならこれ」という感覚を、あとから使える形に残しておきたいと思ったのが、M's Omotenashi Conciergeをつくったきっかけです。
          </p>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-values">
        <Heading id="about-values">私が大切にしていること</Heading>
        <div className="about-prose about-prose-center">
          <p>
            お店や手土産を選ぶとき、大切にしているのは、相手の方の顔を思い浮かべ、良い時間が過ごせるかどうかを考えます。
          </p>
        </div>
        <div className="about-split">
          <div className="about-panel">
            <Illust file="about-dining.png" alt="窓際のレストランの食卓のイラスト" className="about-illustration about-panel-img" />
            <h3>For Restaurant</h3>
            <ul className="about-checks">
              <li>きちんとした接待に使えるか</li>
              <li>個室でゆっくりお話しできるか</li>
              <li>サービスが行き届いて失礼がないか</li>
              <li>コスパが良いか</li>
              <li>お料理は丁寧に作られていて満足出来るか</li>
              <li>ワインやお酒の種類が豊富で、お食事と一緒に楽しめるか</li>
            </ul>
          </div>
          <div className="about-panel">
            <Illust file="about-gifts.png" alt="手土産とギフトのイラスト" className="about-illustration about-panel-img" />
            <h3>For Gift</h3>
            <p className="about-panel-lead">家族構成やライフスタイルも考えます。</p>
            <ul className="about-checks">
              <li>独身の方には日持ちするもので、お一人でも楽しめるものを</li>
              <li>フォーマルな会の場合は、きちんと感もあってありきたりでないもの</li>
              <li>嵩張りすぎず、持ち運びしやすいか</li>
              <li>何より、自分がもらったら、嬉しいと思えるか</li>
            </ul>
          </div>
        </div>
        <p className="about-pullquote">
          美味しいことはもちろんですが、「その場にちょうどいいこと」も、同じくらい大切だと思っています。
        </p>
      </section>

      <section className="about-section" aria-labelledby="about-status">
        <Heading id="about-status">M's Visit と M's Wishlist</Heading>
        <div className="about-prose about-prose-center">
          <p>このサイトでは、実際に訪れた店と、これから行ってみたい店を分けています。</p>
        </div>
        <div className="about-split">
          <article className="about-card">
            <Illust file="about-restaurant-house.png" alt="一軒家レストランのイラスト" className="about-illustration about-card-icon" />
            <h3>M's Visit｜実際に訪問</h3>
            <p>
              自分自身が実際に訪れ、体験した店です。料理だけでなく、雰囲気やサービス、使いやすさなども含めて記録しています。
            </p>
          </article>
          <article className="about-card">
            <Illust file="about-journal.png" alt="ノートと本のイラスト" className="about-illustration about-card-icon" />
            <h3>M's Wishlist｜行ってみたい</h3>
            <p>
              雑誌やWeb、信頼できる情報源、人からのおすすめなどを通じて知り、いつか訪れてみたいと思った店です。
            </p>
          </article>
        </div>
      </section>

      <section className="about-section about-close" aria-labelledby="about-close">
        <Heading id="about-close">このサイトで届けたいこと</Heading>
        <div className="about-prose about-prose-center">
          <p>
            M's Omotenashi Conciergeは、網羅的なグルメサイトを目指しているわけではありません。網羅性よりも、私自身が実際に使い、選び、記憶に残ったものを大切にしています。
          </p>
          <p>
            接待、友人との食事、記念日、気軽なランチ、犬と一緒に行ける店、ワインを楽しめる店、そして贈って喜ばれる手土産。
          </p>
          <p>
            そんな日々の「どこにしよう」「何を選ぼう」を、少し楽しく、少し迷わず決められる場所になればと思っています。
          </p>
        </div>
        <div className="about-cta">
          <Link className="about-cta-btn about-cta-navy" to="/restaurants">
            Restaurantを見る
          </Link>
          <Link className="about-cta-btn about-cta-gold" to="/gifts">
            Giftを見る
          </Link>
        </div>
        <p className="about-home-after">
          <Link to="/" className="about-home-link">
            トップに戻る
          </Link>
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}

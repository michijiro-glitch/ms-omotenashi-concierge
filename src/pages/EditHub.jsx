import { Link } from "react-router-dom";
import PageMeta from "../components/PageMeta.jsx";
import { fullTitle } from "../lib/pageMeta.js";

export default function EditHub() {
  return (
    <div className="page detail-page edit-page">
      <PageMeta title={fullTitle("登録・編集")} description="自分用の登録・編集画面です。" noindex />
      <Link className="back" to="/">
        ← トップ
      </Link>
      <p className="eyebrow">自分用</p>
      <h1 className="detail-name">登録・編集</h1>
      <p className="edit-note">合言葉が必要です。他人には教えないでください。</p>
      <nav className="edit-hub-nav" aria-label="登録する種類">
        <Link className="choice-card" to="/restaurants/new">
          <span className="choice-kicker">Restaurant</span>
          <h2>レストランを追加</h2>
          <span className="choice-note">店を新規登録する</span>
        </Link>
        <Link className="choice-card" to="/gifts/new">
          <span className="choice-kicker">Gift</span>
          <h2>手土産を追加</h2>
          <span className="choice-note">贈り物を新規登録する</span>
        </Link>
      </nav>
    </div>
  );
}

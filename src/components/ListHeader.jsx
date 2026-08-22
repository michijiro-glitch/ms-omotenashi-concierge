import { Link } from "react-router-dom";
import { canEditInApp } from "../lib/sheetWrite.js";

export default function ListHeader({ title, addTo }) {
  return (
    <header className="list-header">
      <Link className="back" to="/">
        ← トップ
      </Link>
      <div className="list-header-row">
        <h1 className="list-title">{title}</h1>
        {addTo && canEditInApp() ? (
          <Link className="list-add" to={addTo}>
            新規登録
          </Link>
        ) : null}
      </div>
    </header>
  );
}

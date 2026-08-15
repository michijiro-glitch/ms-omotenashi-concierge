import { Link } from "react-router-dom";

export default function ListHeader({ title }) {
  return (
    <header className="list-header">
      <Link className="back" to="/">
        ← トップ
      </Link>
      <h1 className="list-title">{title}</h1>
    </header>
  );
}

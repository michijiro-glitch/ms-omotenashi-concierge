import { Link, useLocation } from "react-router-dom";
import { firstGiftPhoto } from "../lib/gifts.js";

function Stars({ value }) {
  return (
    <p className="stars" aria-label={`また使いたい度 ${value}`}>
      {"★".repeat(value)}
      <span className="stars-empty">{"★".repeat(5 - value)}</span>
    </p>
  );
}

export default function GiftCard({ gift, to }) {
  const location = useLocation();
  const photo = firstGiftPhoto(gift);

  return (
    <Link className="card" to={to ?? `/gifts/${gift.id}`} state={{ listSearch: location.search }}>
      <div className="card-photo">
        {photo ? (
          <img src={photo} alt={gift.name} />
        ) : (
          <div className="card-photo-placeholder">
            <span>{gift.brand}</span>
          </div>
        )}
      </div>

      <div className="card-body">
        <h2 className="card-name">{gift.name}</h2>
        <p className="card-meta">
          {gift.brand}
          <span className="dot">·</span>
          {gift.category}
          <span className="dot">·</span>
          {gift.priceRange}
        </p>

        <ul className="tags">
          {gift.recipients.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        {gift.wantToUseAgain ? <Stars value={gift.wantToUseAgain} /> : null}
        {gift.recommend ? <p className="one-liner">{gift.recommend}</p> : null}
      </div>
    </Link>
  );
}

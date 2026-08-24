import { Link, useLocation } from "react-router-dom";
import { statusLabel } from "../lib/formOptions.js";
import { areaLabel, cardTags, firstPhoto } from "../lib/restaurants.js";

function Stars({ value }) {
  return (
    <p className="stars" aria-label={`また行きたい度 ${value}`}>
      {"★".repeat(value)}
      <span className="stars-empty">{"★".repeat(5 - value)}</span>
    </p>
  );
}

export default function RestaurantCard({ restaurant, to }) {
  const location = useLocation();
  const visited = restaurant.status === "行ったことがある";
  const photo = firstPhoto(restaurant);
  const area = areaLabel(restaurant);

  return (
    <Link
      className="card"
      to={to ?? `/restaurants/${restaurant.id}`}
      state={{ listSearch: location.search }}
    >
      <div className="card-photo">
        {photo ? (
          <img src={photo} alt={restaurant.name} />
        ) : (
          <div className="card-photo-placeholder">
            <span>{area}</span>
          </div>
        )}
        <span className="badge">{statusLabel(restaurant.status)}</span>
      </div>

      <div className="card-body">
        <h2 className="card-name">{restaurant.name}</h2>
        <p className="card-meta">
          {area}
          <span className="dot">·</span>
          {restaurant.genre}
          <span className="dot">·</span>
          {restaurant.priceRange}
        </p>

        <ul className="tags">
          {cardTags(restaurant).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        {visited && restaurant.wantToGoAgain ? (
          <Stars value={restaurant.wantToGoAgain} />
        ) : null}

        {visited && restaurant.oneLiner ? (
          <p className="one-liner">{restaurant.oneLiner}</p>
        ) : null}

        {!visited && restaurant.mediaName ? (
          <p className="media-line">{restaurant.mediaName}</p>
        ) : null}
      </div>
    </Link>
  );
}

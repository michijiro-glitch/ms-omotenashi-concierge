import { useState } from "react";

export default function PhotoGallery({ photos, alt, placeholder }) {
  const [index, setIndex] = useState(0);
  const selected = photos[index] ? index : 0;
  const hero = photos[selected];

  if (!photos.length) {
    return (
      <div className="hero">
        <div className="hero-placeholder">
          <span>{placeholder}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hero">
        <img src={hero} alt={alt} />
      </div>
      {photos.length > 1 ? (
        <ul className="photo-thumbs">
          {photos.map((src, photoIndex) => (
            <li key={`${src}-${photoIndex}`}>
              <button
                type="button"
                className={photoIndex === selected ? "is-selected" : undefined}
                aria-label={`${alt}の写真${photoIndex + 1}を大きく表示`}
                aria-pressed={photoIndex === selected}
                onClick={() => setIndex(photoIndex)}
              >
                <img src={src} alt="" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

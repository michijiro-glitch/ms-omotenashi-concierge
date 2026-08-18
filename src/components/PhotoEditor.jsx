import { MAX_PHOTOS } from "../lib/photos.js";

export default function PhotoEditor({ items, onChange }) {
  return (
    <div className="edit-field">
      <span>写真（最大{MAX_PHOTOS}枚）</span>
      <ul className="edit-photos">
        {items.map((item) => (
          <li key={item.key} className="edit-photo">
            <img src={item.src} alt="" />
            <button
              type="button"
              className="edit-photo-remove"
              onClick={() => onChange(items.filter((current) => current.key !== item.key))}
            >
              外す
            </button>
          </li>
        ))}
      </ul>
      {items.length < MAX_PHOTOS ? (
        <label className="edit-photo-add">
          写真を追加する
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              const files = [...(event.target.files || [])];
              event.target.value = "";
              if (!files.length) return;
              const room = MAX_PHOTOS - items.length;
              const next = files.slice(0, room).map((file, index) => ({
                key: `${file.name}-${file.lastModified}-${index}-${Date.now()}`,
                src: URL.createObjectURL(file),
                file,
              }));
              onChange([...items, ...next]);
            }}
          />
        </label>
      ) : null}
    </div>
  );
}

export default function SearchMeta({ count, loading, hasFilters, onClear }) {
  return (
    <div className="search-meta">
      <p className="count">{loading ? "読み込み中…" : `${count}件`}</p>
      {hasFilters ? (
        <button type="button" className="clear-filters" onClick={onClear}>
          条件をクリア
        </button>
      ) : null}
    </div>
  );
}

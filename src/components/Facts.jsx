export default function Facts({ items }) {
  const rows = items.filter((item) => item.value);
  if (!rows.length) return null;

  return (
    <dl className="facts">
      {rows.map(({ label, value }) => (
        <div key={label} className="facts-row">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function FilterSelect({ label, value, onChange, options, allLabel }) {
  return (
    <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{allLabel}</option>
      {options.map((option) => {
        const item = typeof option === "string" ? { value: option, label: option } : option;
        return (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        );
      })}
    </select>
  );
}

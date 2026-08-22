export default function CheckFilter({ legend, options, values, onToggle }) {
  return (
    <fieldset className="check-filter">
      <legend>{legend}</legend>
      <div className="edit-checks">
        {options.map((option) => (
          <label key={option} className="edit-check">
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={() => onToggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

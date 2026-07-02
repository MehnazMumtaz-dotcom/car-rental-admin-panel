export default function Select({
  options = [],
  value = "",
  onChange,
  placeholder = "Select option",
  className = "",
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full px-3 py-2 border border-borderColor rounded-xl 
      bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary 
      ${className}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>

      {options.map((opt, index) => {
        const val = typeof opt === "string" ? opt : opt.value;
        const label = typeof opt === "string" ? opt : opt.label;

        return (
          <option key={val || index} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
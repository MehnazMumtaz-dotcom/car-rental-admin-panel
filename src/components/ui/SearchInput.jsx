export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)} // ✅ safe call
        className={`w-full px-3 py-2 border border-borderColor rounded-xl 
        bg-surface text-textPrimary 
        focus:outline-none focus:ring-2 focus:ring-primary 
        ${className}`}
      />
    </div>
  );
}
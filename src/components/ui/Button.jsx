export default function Button({ children, onClick, type = "button", variant = "primary" }) {
  const base = "px-4 py-2 rounded-xl font-medium transition";

  const variants = {
    primary: "bg-primary text-white hover:bg-primaryHover",
    secondary: "bg-secondary text-white hover:bg-secondaryLight",
    outline: "border border-borderColor text-textPrimary hover:bg-background",
    danger: "bg-danger text-white hover:opacity-90",
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}
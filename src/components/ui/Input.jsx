import Label from "./Label";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col gap-1">

      {label && <Label>{label}</Label>}


      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-3 py-2 rounded-xl border border-borderColor 
        focus:outline-none focus:ring-2 focus:ring-primary 
        bg-surface text-textPrimary text-sm w-full"
      />
    </div>
  );
}
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "../../lib/utils";

// Radix Select doesn't allow an empty string as an item value, but this
// project's filters rely on value:"" to mean "All / no filter". This
// sentinel is translated back to "" before it ever reaches onChange, so
// every existing call site (Filters, ComplaintFilters, forms, etc.) keeps
// working exactly as before without any changes.
const EMPTY_VALUE = "__all__";

export default function Select({
  options = [],
  value = "",
  onChange,
  placeholder = "Select option",
  className = "",
}) {
  const normalized = options.map((opt) => {
    const label = typeof opt === "string" ? opt : opt.label;
    const rawValue = typeof opt === "string" ? opt : opt.value;
    return { label, value: rawValue === "" ? EMPTY_VALUE : rawValue };
  });

  const currentValue = value === "" ? EMPTY_VALUE : value;

  const handleChange = (val) => {
    onChange?.(val === EMPTY_VALUE ? "" : val);
  };

  return (
    <SelectPrimitive.Root value={currentValue || undefined} onValueChange={handleChange}>
      <SelectPrimitive.Trigger
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 border border-borderColor rounded-xl",
          "bg-surface text-textPrimary text-sm focus:outline-none focus:ring-2 focus:ring-primary",
          className
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown size={16} className="text-textSecondary shrink-0" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="bg-surface border border-borderColor rounded-xl shadow-card overflow-hidden z-50"
          position="popper"
          sideOffset={4}
        >
          <SelectPrimitive.Viewport className="p-1">
            {normalized.map((opt, index) => (
              <SelectPrimitive.Item
                key={opt.value || index}
                value={opt.value}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm text-textPrimary cursor-pointer select-none",
                  "hover:bg-background focus:bg-background outline-none data-[state=checked]:bg-primary/10"
                )}
              >
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Check size={14} className="text-primary" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
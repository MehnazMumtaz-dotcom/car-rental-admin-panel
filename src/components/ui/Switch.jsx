import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../../lib/utils";

const Switch = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    checked={checked}
    onCheckedChange={onCheckedChange}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      checked ? "bg-success" : "bg-borderColor",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow transition-transform translate-x-0.5",
        checked && "translate-x-5"
      )}
    />
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";

export default Switch;
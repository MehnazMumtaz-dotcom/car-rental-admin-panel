import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva("px-4 py-2 rounded-xl font-medium transition disabled:opacity-60 disabled:cursor-not-allowed", {
  variants: {
    variant: {
      primary: "bg-primary text-white hover:bg-primaryHover",
      secondary: "bg-secondary text-white hover:bg-secondaryLight",
      outline: "border border-borderColor text-textPrimary hover:bg-background",
      danger: "bg-danger text-white hover:opacity-90",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(buttonVariants({ variant }), className)}
    >
      {children}
    </button>
  );
}
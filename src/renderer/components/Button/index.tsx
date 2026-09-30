import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonVariant = "dark" | "accent" | "light";

interface ButtonProps extends PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  dark: ["bg-rosewood-ink", "text-white", "border-rosewood-ink"].join(" "),
  accent: ["bg-rosewood-accent", "text-white", "border-rosewood-ink"].join(" "),
  light: ["bg-rosewood-surface", "text-rosewood-ink", "border-rosewood-ink"].join(
    " ",
  ),
};

export function Button({
  children,
  variant = "light",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        "rounded-md border-2 px-5 py-2",
        "font-bold",
        "transition-transform",
        "shadow-[4px_4px_0_var(--color-rosewood-ink)]",
        "active:translate-x-1 active:translate-y-1 active:shadow-none",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}

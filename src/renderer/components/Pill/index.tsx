import { PropsWithChildren } from "react";

type PillVariant = "accent" | "dark" | "info" | "neutral";

interface PillProps extends PropsWithChildren {
  variant?: PillVariant;
  className?: string;
}

const variants: Record<PillVariant, string> = {
  accent: "bg-rosewood-accent text-rosewood-surface",
  dark: "bg-rosewood-ink text-rosewood-surface",
  info: " bg-rosewood-info text-rosewood-surface",
  neutral: "bg-rosewood-paper text-rosewood-ink",
};

export function Pill({
  children,
  variant = "neutral",
  className = "",
}: PillProps) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        "rounded-sm border-2 border-rosewood-ink",
        "px-2 py-1",
        "text-sm font-bold leading-none",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
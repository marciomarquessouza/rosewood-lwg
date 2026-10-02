import { PropsWithChildren, useEffect } from "react";

export type FeedbackTypes = "error" | "warning" | "info" | "success";

interface FeedbackProps extends PropsWithChildren {
  variant?: FeedbackTypes;
  className?: string;
  onTimeout?: () => void;
  timeout?: number;
}

const variants: Record<FeedbackTypes, string> = {
  error: ["bg-red-50", "border-red-700", "text-red-800"].join(" "),
  warning: ["bg-yellow-50", "border-yellow-700", "text-yellow-800"].join(" "),
  info: [
    "bg-rosewood-surface",
    "border-rosewood-blue",
    "text-rosewood-ink",
  ].join(" "),
  success: ["bg-green-50", "border-green-700", "text-green-800"].join(" "),
};

export function Feedback({
  children,
  variant = "error",
  className = "",
  timeout,
  onTimeout,
}: FeedbackProps) {
  useEffect(() => {
    if (!onTimeout || !timeout) return;
    setTimeout(onTimeout, timeout);
  }, [onTimeout, timeout]);

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={[
        "rounded-md border-2 px-4 py-3",
        "font-medium",
        "shadow-[3px_3px_0_var(--color-rosewood-ink)]",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

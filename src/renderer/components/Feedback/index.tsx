import { X } from "lucide-react";
import { PropsWithChildren } from "react";

export const FEEDBACK_TYPES = ["success", "error", "warning", "info"] as const;

export type FeedbackTypes = (typeof FEEDBACK_TYPES)[number];

export type FeedbackState = {
  type: FeedbackTypes;
  message: string;
  timeout?: number;
  onClose?: () => void;
};

interface FeedbackProps extends PropsWithChildren {
  variant?: FeedbackTypes;
  className?: string;
  onClose?: () => void;
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
  onClose,
}: FeedbackProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={[
        "relative rounded-md border-2 px-4 py-3",
        "font-medium",
        "shadow-[3px_3px_0_var(--color-rosewood-ink)]",
        variants[variant],
        onClose ? "pr-10" : "",
        className,
      ].join(" ")}
    >
      {children}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close feedback"
          className={[
            "absolute right-2 top-2",
            "flex h-7 w-7 items-center justify-center",
            "rounded-md",
            "opacity-60 transition-all duration-200",
            "hover:bg-current/10 hover:opacity-100",
            "active:scale-95",
            "focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-current",
            "cursor-pointer",
          ].join(" ")}
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

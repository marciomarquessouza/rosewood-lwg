import { PropsWithChildren, useCallback, useEffect, useState } from "react";

export const FEEDBACK_TYPES = ["success", "error", "warning", "info"] as const;

export type FeedbackTypes = (typeof FEEDBACK_TYPES)[number];

export type FeedbackState = {
  type: FeedbackTypes;
  message: string;
};

interface FeedbackProps extends PropsWithChildren {
  variant?: FeedbackTypes;
  className?: string;
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
}: FeedbackProps) {
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

export function useFeedback(timeout = 5000) {
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  useEffect(() => {
    if (!feedback || !timeout) return;

    const timer = setTimeout(clearFeedback, timeout);

    return () => clearTimeout(timer);
  }, [feedback, timeout, clearFeedback]);

  return {
    feedback,
    setFeedback,
    clearFeedback,
  };
}

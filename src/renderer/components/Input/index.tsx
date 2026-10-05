import type { InputHTMLAttributes } from "react";

type LabelVariant = "dark" | "accent";
type InputVariant = "default" | "light";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelVariant?: LabelVariant;
  error?: string;
}

const LABEL_VARIANTS: Record<LabelVariant, string> = {
  dark: ["font-bold", "text-rosewood-ink"].join(" "),
  accent: ["font-bold", "text-rosewood-accent"].join(" "),
};

export function Input({
  label,
  id,
  labelVariant = "dark",
  error,
  className = "",
  ...props
}: InputProps) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className={LABEL_VARIANTS[labelVariant]}>
          {label}
        </label>
      )}

      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`
          rounded-md
          border-2
          ${error ? "border-rosewood-accent" : "border-rosewood-ink"}
          bg-rosewood-surface
          px-3
          py-2
          text-rosewood-ink
          outline-none
          transition-shadow
          placeholder:text-rosewood-ink/60
          focus:shadow-[3px_3px_0_var(--color-rosewood-ink)]
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}
        `}
        {...props}
      />

      {error && (
        <span
          id={errorId}
          role="alert"
          className="text-sm font-bold text-rosewood-accent"
        >
          {error}
        </span>
      )}
    </div>
  );
}

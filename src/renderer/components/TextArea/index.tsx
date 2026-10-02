import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({
  label,
  id,
  error,
  className = "",
  ...props
}: TextAreaProps) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-bold text-rosewood-ink">
          {label}
        </label>
      )}

      <textarea
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`
          min-h-16
          w-full
          resize-y
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

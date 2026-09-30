import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function TextArea({
  label,
  id,
  className = "",
  ...props
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-bold text-rosewood-ink">
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={`
          min-h-16
          w-full
          resize-y
          rounded-md
          border-2
          border-rosewood-ink
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
    </div>
  );
}

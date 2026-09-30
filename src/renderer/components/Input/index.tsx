import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-bold text-rosewood-ink">
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
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

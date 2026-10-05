import type { InputHTMLAttributes } from "react";

type LabelVariant = "dark" | "accent";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  labelVariant?: LabelVariant;
  error?: string;
}

const LABEL_VARIANTS: Record<LabelVariant, string> = {
  dark: ["font-bold", "text-rosewood-ink"].join(" "),
  accent: ["font-bold", "text-rosewood-accent"].join(" "),
};

export function Checkbox({
  label,
  id,
  labelVariant = "dark",
  error,
  className = "",
  ...props
}: CheckboxProps) {
  const errorId = id ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className={`
          flex
          w-fit
          cursor-pointer
          items-center
          gap-2
          ${props.disabled ? "cursor-not-allowed opacity-50" : ""}
        `}
      >
        <input
          {...props}
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`
            size-5
            cursor-pointer
            appearance-none
            rounded
            border-2
            ${error ? "border-rosewood-accent" : "border-rosewood-ink"}
            bg-rosewood-surface
            outline-none
            transition-shadow
            checked:bg-rosewood-ink
            checked:after:flex
            checked:after:h-full
            checked:after:items-center
            checked:after:justify-center
            checked:after:text-sm
            checked:after:font-bold
            checked:after:text-rosewood-surface
            checked:after:content-['✓']
            focus:shadow-[2px_2px_0_var(--color-rosewood-ink)]
            disabled:cursor-not-allowed
            ${className}
          `}
        />

        {label && (
          <span className={LABEL_VARIANTS[labelVariant]}>{label}</span>
        )}
      </label>

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
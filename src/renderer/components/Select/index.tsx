import type { SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  options,
  placeholder,
  id,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-bold text-rosewood-ink">
          {label}
        </label>
      )}

      <select
        id={id}
        className={`
          cursor-pointer
          rounded-md
          border-2
          border-rosewood-ink
          bg-rosewood-surface
          px-3
          py-2
          text-rosewood-ink
          outline-none
          transition-shadow
          focus:shadow-[3px_3px_0_var(--color-rosewood-ink)]
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map(({ value, label, disabled }) => (
          <option key={value} value={value} disabled={disabled}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

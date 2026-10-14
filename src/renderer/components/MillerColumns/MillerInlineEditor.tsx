import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface MillerInlineEditorProps {
  initialValue?: string;
  placeholder?: string;
  onSubmit: (value: string) => void | Promise<void>;
  onCancel: () => void;
  className?: string;
}

export function MillerInlineEditor({
  initialValue = "",
  placeholder = "Enter name...",
  onSubmit,
  onCancel,
  className = "",
}: MillerInlineEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  useLayoutEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = async () => {
    if (submittingRef.current) return;

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      onCancel();
      return;
    }

    if (trimmedValue === initialValue.trim()) {
      onCancel();
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      await onSubmit(trimmedValue);
    } catch {
      submittingRef.current = false;
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();

    if (event.key === "Enter") {
      event.preventDefault();
      void handleSubmit();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      placeholder={placeholder}
      disabled={isSubmitting}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => void handleSubmit()}
      onClick={(event) => event.stopPropagation()}
      className={[
        "w-full min-w-0 rounded-sm",
        "border border-rosewood-accent",
        "bg-transparent px-2 py-1.5",
        "text-sm text-rosewood-ink",
        "placeholder:text-rosewood-ink/40",
        "outline-none",
        "focus:ring-1 focus:ring-rosewood-accent/30",
        "disabled:opacity-50",
        className,
      ].join(" ")}
    />
  );
}

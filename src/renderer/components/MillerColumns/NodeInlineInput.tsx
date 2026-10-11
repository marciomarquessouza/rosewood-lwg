import { SubmitEvent, useState } from "react";
import { Plus } from "lucide-react";

interface NodeInlineInputProps {
  placeholder?: string;
  onSubmit: (value: string) => void | Promise<void>;
}

export function NodeInlineInput({
  placeholder = "Type a name...",
  onSubmit,
}: NodeInlineInputProps) {
  const [value, setValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = value.trim();

    if (!name || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await onSubmit(name);
      setValue("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div
        className={[
          "flex items-center gap-2",
          "rounded-sm border border-dashed border-rosewood-ink/30",
          "px-3 py-2",
          "transition-colors duration-150",
          "focus-within:border-rosewood-accent",
          "focus-within:bg-rosewood-accent/5",
        ].join(" ")}
      >
        <Plus size={16} className="shrink-0 text-rosewood-ink/50" />

        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting}
          aria-label={placeholder}
          className={[
            "min-w-0 flex-1 bg-transparent",
            "text-sm text-rosewood-ink",
            "placeholder:text-rosewood-ink/40",
            "outline-none",
          ].join(" ")}
        />

        {value.trim() && (
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label="Create node"
            className={[
              "shrink-0 cursor-pointer",
              "text-xs font-bold text-rosewood-accent",
              "hover:opacity-70",
              "disabled:cursor-not-allowed disabled:opacity-40",
            ].join(" ")}
          >
            Add
          </button>
        )}
      </div>
    </form>
  );
}

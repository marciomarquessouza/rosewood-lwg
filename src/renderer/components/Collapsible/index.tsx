import { useState, type ReactNode } from "react";

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Collapsible({
  title,
  children,
  defaultOpen = true,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section>
      <button
        type="button"
        className="flex items-center gap-2 font-bold text-rosewood-ink cursor-pointer"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span
          className={`
            text-rosewood-accent
            transition-transform
            ${isOpen ? "rotate-90" : ""}
          `}
        >
          ▶
        </span>

        {title}
      </button>

      {isOpen && <div className="mt-2">{children}</div>}
    </section>
  );
}

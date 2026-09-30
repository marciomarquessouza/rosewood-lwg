import { PropsWithChildren, ReactNode } from "react";

type PanelVariant = "primary" | "support";

interface PanelProps extends PropsWithChildren {
  header?: ReactNode;
  footer?: ReactNode;
  variant?: PanelVariant;
  className?: string;
}

export function Panel({
  children,
  header,
  footer,
  variant = "primary",
  className = "",
}: PanelProps) {
  const isSupport = variant === "support";
  return (
    <section
      className={[
        "rounded-lg border-2 border-rosewood-ink bg-white",
        isSupport
          ? "shadow-[6px_7px_0_var(--color-rosewood-accent)]"
          : "shadow-[10px_10px_0_var(--color-rosewood-ink)]",
        className,
      ].join(" ")}
    >
      {header && (
        <header className="px-7 pt-6">
          {header}

          <div
            className={[
              "mt-4 border-t-2 border-rosewood-ink",
              isSupport ? "border-dotted" : "border-solid",
            ].join(" ")}
          />
        </header>
      )}

      <div className="p-7">{children}</div>

      {footer && (
        <footer className="flex justify-center px-7 pb-6">{footer}</footer>
      )}
    </section>
  );
}

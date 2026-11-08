import { ArrowUpRight, Fingerprint } from "lucide-react";
import type { ReactNode } from "react";

export interface ProfileCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  identifier?: string;
  index?: number;
  label?: string;
  actionLabel?: string;
  avatar?: ReactNode;
  footerIcon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ProfileCard({
  title,
  subtitle,
  description,
  identifier,
  index,
  label = "FILE",
  actionLabel = "View details",
  avatar,
  footerIcon = <Fingerprint size={14} />,
  onClick,
  className = "",
}: ProfileCardProps) {
  const initials = title
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const number =
    index !== undefined ? String(index + 1).padStart(2, "0") : undefined;

  const interactive = typeof onClick === "function";

  const classes = [
    "group relative flex h-full min-h-[330px] w-full",
    "flex-col overflow-hidden text-left",
    "rounded-lg border-2 border-rosewood-ink",
    "bg-rosewood-surface",
    "shadow-[5px_5px_0_var(--color-rosewood-ink)]",
    "transition-all duration-200",
    interactive && "cursor-pointer hover:-translate-y-1",
    interactive && "hover:shadow-[7px_9px_0_var(--color-rosewood-ink)]",
    interactive && "focus-visible:outline-2",
    interactive && "focus-visible:outline-offset-4",
    interactive && "focus-visible:outline-rosewood-accent",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <div className="relative flex h-36 shrink-0 items-center justify-center overflow-hidden border-b-2 border-rosewood-ink bg-rosewood-paper">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-12 -right-3 select-none font-serif text-[180px] font-black leading-none text-rosewood-ink/5"
        >
          {initials.charAt(0)}
        </span>

        {number && (
          <span className="absolute left-4 top-4 font-mono text-[11px] font-bold tracking-[0.2em] text-rosewood-ink/50">
            {label} / {number}
          </span>
        )}

        {interactive && (
          <span className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border border-rosewood-ink/20 bg-rosewood-surface transition-all duration-200 group-hover:border-rosewood-accent group-hover:bg-rosewood-accent group-hover:text-white">
            <ArrowUpRight size={17} />
          </span>
        )}

        <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-rosewood-ink bg-rosewood-surface shadow-[4px_4px_0_var(--color-rosewood-ink)] transition-transform duration-300 group-hover:scale-105">
          {avatar ?? (
            <span className="font-serif text-4xl font-bold tracking-tight text-rosewood-ink">
              {initials || "?"}
            </span>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-5">
        <div className="mb-3">
          <h3 className="font-serif text-2xl font-bold leading-tight tracking-tight text-rosewood-ink">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-xs tracking-wide text-rosewood-ink/60">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mb-3 flex items-center gap-2">
          <span className="size-1.5 rotate-45 bg-rosewood-accent" />
          <span className="h-px flex-1 bg-rosewood-ink/15" />
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-rosewood-ink/75">
          {description || "No description available."}
        </p>

        {(identifier || (interactive && actionLabel)) && (
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            {identifier && (
              <div className="flex min-w-0 items-center gap-2 text-rosewood-ink/50">
                {footerIcon}
                <span className="truncate font-mono text-[11px] tracking-wide">
                  {identifier}
                </span>
              </div>
            )}

            {interactive && actionLabel && (
              <span className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-rosewood-accent transition-transform group-hover:translate-x-0.5">
                {actionLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (interactive) {
    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={onClick}
          className={classes}
          aria-label={`${actionLabel}: ${title}`}
        >
          {content}
        </button>
      </div>
    );
  }

  return <article className={classes}>{content}</article>;
}

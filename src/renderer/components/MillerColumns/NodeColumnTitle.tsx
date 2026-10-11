interface NodeColumnTitleProps {
  title: string;
  counter?: number;
}

export function NodeColumnTitle({ title, counter }: NodeColumnTitleProps) {
  return (
    <div
      className={[
        "flex h-11 shrink-0 items-center justify-between",
        "border-b border-dashed border-rosewood-ink/30",
        "bg-rosewood-ink/5 px-4",
      ].join(" ")}
    >
      <h3
        className={[
          "min-w-0 flex-1 truncate",
          "text-xs font-bold uppercase tracking-widest",
          "text-rosewood-ink/70",
        ].join(" ")}
      >
        {title}
      </h3>

      {counter && (
        <span className="ml-2 shrink-0 text-xs font-medium tabular-nums text-rosewood-ink/40">
          {counter}
        </span>
      )}
    </div>
  );
}

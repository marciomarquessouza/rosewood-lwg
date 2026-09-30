interface ProgressBarProps {
  value: number;
  max?: number;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showPercentage = true,
  className = "",
}: ProgressBarProps) {
  const percentage =
    max > 0
      ? Math.min(100, Math.max(0, Math.round((value / max) * 100)))
      : 0;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="h-4 w-36 overflow-hidden rounded-sm border-2 border-rosewood-ink bg-rosewood-bg"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className="h-full bg-rosewood-accent transition-[width] duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showPercentage && (
        <span className="min-w-9 text-sm font-bold text-rosewood-ink">
          {percentage}%
        </span>
      )}
    </div>
  );
}
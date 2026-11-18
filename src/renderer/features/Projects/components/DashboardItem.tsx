import { useNavigate } from "react-router-dom";
import { ArrowUpRight, BookOpen, CalendarDays, Pencil, Trash2 } from "lucide-react";
import type { ProjectContent } from "sue-tissue-lwg/schemas/project";
import type { Language } from "sue-tissue-lwg/schemas/language";
import type { Level } from "sue-tissue-lwg/schemas/level";

import { LANGUAGE_DETAILS } from "../../../../constants";

interface DashboardItemProps extends ProjectContent {
  loading: boolean;
  onDelete: (language: Language, level: Level) => void | Promise<void>;
}

export function DashboardItem({
  loading,
  level,
  language,
  plannedDays,
  createdDays,
  onDelete,
}: DashboardItemProps) {
  const navigate = useNavigate();
  const percentage = plannedDays > 0
    ? Math.min(100, Math.max(0, Math.round((createdDays / plannedDays) * 100)))
    : 0;
  const title = LANGUAGE_DETAILS[language].name;
  const route = `/project/${language}/${level}`;
  const daysRoute = `${route}/days`;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border-2 border-rosewood-ink bg-rosewood-surface shadow-[4px_4px_0_var(--color-rosewood-ink)] transition-transform hover:-translate-y-0.5">
      <button
        type="button"
        onClick={() => navigate(daysRoute)}
        className="flex min-w-0 flex-1 flex-col p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-rosewood-accent"
        aria-label={`Open ${title} ${level} days`}
      >
        <div className="flex w-full items-start justify-between gap-3">
          <span className="rounded-sm bg-rosewood-ink px-2.5 py-1 font-mono text-xs font-bold text-white">
            {level}
          </span>
          <ArrowUpRight size={19} className="text-rosewood-ink/45 transition-colors group-hover:text-rosewood-accent" aria-hidden="true" />
        </div>

        <h3 className="mt-6 font-serif text-2xl font-bold leading-tight text-rosewood-ink">
          {title}
        </h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-rosewood-ink/55">
          {language} / {level}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-rosewood-ink/15 pt-5">
          <div>
            <div className="flex items-center gap-1.5 text-rosewood-ink/55">
              <CalendarDays size={14} aria-hidden="true" />
              <span className="text-xs">Created</span>
            </div>
            <p className="mt-1 font-serif text-2xl font-bold tabular-nums">
              {createdDays}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-rosewood-ink/55">
              <BookOpen size={14} aria-hidden="true" />
              <span className="text-xs">Planned</span>
            </div>
            <p className="mt-1 font-serif text-2xl font-bold tabular-nums">
              {plannedDays}
            </p>
          </div>
        </div>

        <div className="mt-5 w-full">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs">
            <span className="text-rosewood-ink/60">Curriculum progress</span>
            <strong className="font-mono text-rosewood-ink">{percentage}%</strong>
          </div>
          <div
            role="progressbar"
            aria-label={`${title} ${level} completion`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage}
            className="h-2 overflow-hidden rounded-full bg-rosewood-ink/10"
          >
            <div className="h-full rounded-full bg-rosewood-accent" style={{ width: `${percentage}%` }} />
          </div>
        </div>
      </button>

      <div className="flex flex-wrap items-center gap-2 border-t border-rosewood-ink/15 bg-white/60 px-5 py-3">
        <button
          type="button"
          onClick={() => navigate(route)}
          className="inline-flex items-center gap-1.5 rounded-md border border-rosewood-ink/20 bg-white px-3 py-2 text-xs font-bold text-rosewood-ink transition-colors hover:border-rosewood-accent hover:text-rosewood-accent"
        >
          <Pencil size={14} aria-hidden="true" /> Edit
        </button>
        <button
          type="button"
          onClick={() => navigate(daysRoute)}
          className="inline-flex items-center gap-1.5 rounded-md border border-rosewood-ink/20 bg-white px-3 py-2 text-xs font-bold text-rosewood-ink transition-colors hover:border-rosewood-accent hover:text-rosewood-accent"
        >
          <CalendarDays size={14} aria-hidden="true" /> Day list
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => void onDelete(language, level)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-2 text-xs font-bold text-rosewood-accent transition-colors hover:bg-rosewood-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={14} aria-hidden="true" /> Remove
        </button>
      </div>
    </article>
  );
}

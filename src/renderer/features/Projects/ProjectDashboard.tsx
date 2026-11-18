import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Globe2,
  Layers3,
  Plus,
  ArrowUpRight,
} from "lucide-react";

import { Panel } from "../../components/Panel";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { LANGUAGE_DETAILS } from "../../../constants";
import { Language, languageSchema } from "../../../schemas/language";
import { Level, levelSchema } from "../../../schemas/level";
import { useFeedback } from "../../contexts/FeedbackContext";
import { DashboardItem } from "./components/DashboardItem";

function percent(created: number, planned: number): number {
  if (planned <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((created / planned) * 100)));
}

export function ProjectDashboard() {
  const navigate = useNavigate();
  const { connected, projectPath } = useProjectInfo();
  const { filterProjectLines, loadProjectContent, loading, error } =
    useProjectContent();
  const { language: languageParam, level: levelParam } = useParams();
  const language = languageParam
    ? languageSchema.parse(languageParam)
    : undefined;
  const level = levelParam ? levelSchema.parse(levelParam) : undefined;
  const [actionLoading, setActionLoading] = useState<
    "delete" | null
  >(null);
  const { showFeedback, clearFeedback } = useFeedback();

  const projectLines = filterProjectLines({ language, level });
  const languageCount = new Set(projectLines.map((line) => line.language)).size;
  const createdDays = projectLines.reduce(
    (total, line) => total + line.createdDays,
    0,
  );
  const plannedDays = projectLines.reduce(
    (total, line) => total + line.plannedDays,
    0,
  );
  const progress = percent(createdDays, plannedDays);

  const handleDelete = async (targetLanguage: Language, targetLevel: Level) => {
    const confirmed = window.confirm(
      `Remove ${LANGUAGE_DETAILS[targetLanguage].name} ${targetLevel}? This will permanently delete all its content.`,
    );
    if (!confirmed) return;

    clearFeedback();
    setActionLoading("delete");
    try {
      await window.rosewood.deleteProjectContent(
        projectPath,
        targetLanguage,
        targetLevel,
      );
      await loadProjectContent();
      showFeedback({
        type: "success",
        message: `Project removed - ${targetLanguage}|${targetLevel}`,
      });
    } catch (cause) {
      showFeedback({
        type: "error",
        message: cause instanceof Error ? cause.message : "Unexpected error",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="h-full min-h-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-6">
          <header className="flex flex-wrap items-end justify-between gap-4 border-b border-rosewood-ink/15 pb-5">
            <div>
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.23em] text-rosewood-accent">
                Curriculum / Workspace
              </p>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-rosewood-ink">
                Lessons
              </h1>
              <p className="mt-1 text-sm text-rosewood-ink/60">
                Languages, lesson tracks and curriculum progress
              </p>
            </div>
            <button
              type="button"
              disabled={!connected || !!actionLoading}
              onClick={() => navigate("/project/new")}
              className="inline-flex items-center gap-2 rounded-md border-2 border-rosewood-ink bg-rosewood-ink px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-[3px_3px_0_var(--color-rosewood-ink)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} aria-hidden="true" />
              New language / level
            </button>
          </header>

          {!connected ? (
            <p className="rounded-lg border border-rosewood-ink/20 bg-rosewood-paper p-6 text-sm text-rosewood-ink/70">
              Connect a project to see its lessons.
            </p>
          ) : error ? (
            <p role="alert" className="rounded-lg border border-rosewood-accent bg-rosewood-paper p-6 text-sm text-rosewood-accent">
              {error}
            </p>
          ) : loading ? (
            <p className="rounded-lg border border-rosewood-ink/20 bg-rosewood-paper p-6 text-sm">
              Loading lessons...
            </p>
          ) : (
            <>
              <section aria-label="Curriculum overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { label: "Languages", value: languageCount, icon: Globe2 },
                  { label: "Lesson tracks", value: projectLines.length, icon: Layers3 },
                  { label: "Days created", value: createdDays, icon: CalendarDays },
                  { label: "Planned days", value: plannedDays, icon: BookOpen },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="relative flex min-h-28 flex-col justify-between rounded-lg border border-rosewood-ink/20 bg-rosewood-paper p-4 sm:p-5"
                  >
                    <Icon size={19} className="absolute right-4 top-4 text-rosewood-accent" aria-hidden="true" />
                    <p className="pr-6 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-rosewood-ink/60">
                      {label}
                    </p>
                    <strong className="mt-4 font-serif text-4xl font-bold leading-none text-rosewood-ink">
                      {value}
                    </strong>
                  </div>
                ))}
              </section>

              <section aria-label="Lesson tracks">
                <div className="mb-5 flex items-end justify-between gap-3 border-b border-rosewood-ink/15 pb-4">
                  <div>
                    <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rosewood-accent">
                      01 / Curriculum
                    </p>
                    <h2 className="font-serif text-2xl font-bold text-rosewood-ink">
                      Lesson tracks{" "}
                      <span className="font-sans text-sm font-normal text-rosewood-ink/45">
                        ({projectLines.length})
                      </span>
                    </h2>
                  </div>
                  <ArrowUpRight size={19} className="text-rosewood-ink/30" aria-hidden="true" />
                </div>

                {projectLines.length > 0 ? (
                  <div className="grid items-stretch gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                    {projectLines.map((line) => (
                      <DashboardItem
                        key={`${line.language}-${line.level}`}
                        {...line}
                        loading={actionLoading === "delete"}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-rosewood-ink/30 bg-rosewood-surface/50 px-6 py-12 text-center">
                    <BookOpen size={28} className="mx-auto mb-3 text-rosewood-accent" aria-hidden="true" />
                    <p className="font-serif text-xl font-bold">No lesson tracks yet</p>
                    <p className="mt-1 text-sm text-rosewood-ink/60">
                      Create a language and level to start organizing your lessons.
                    </p>
                  </div>
                )}
              </section>

              <section className="grid gap-5 rounded-lg border border-rosewood-ink/20 bg-rosewood-paper p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-7">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rosewood-accent">
                    Total curriculum progress
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-rosewood-ink">
                    {createdDays}{" "}
                    <span className="font-normal text-rosewood-ink/50">
                      / {plannedDays} planned days
                    </span>
                  </h2>
                  <div
                    className="mt-4 h-2.5 w-full max-w-2xl overflow-hidden rounded-full bg-rosewood-ink/10"
                    role="progressbar"
                    aria-label="Total curriculum completion"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress}
                  >
                    <div className="h-full rounded-full bg-rosewood-accent transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <strong className="font-serif text-5xl font-bold text-rosewood-ink sm:text-6xl">
                  {progress}%
                </strong>
              </section>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

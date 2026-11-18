/* eslint-disable @typescript-eslint/no-empty-function */
import { useState } from "react";
import {
  BookOpenText,
  MessageSquareText,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Clock3,
  GraduationCap,
  NotebookPen,
  ScrollText,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Panel } from "../../components/Panel";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";

import { useDayForm } from "./hooks/useDayForm";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { useDaysContent } from "../../contexts/DaysContentContext";

import { languageSchema } from "../../../schemas/language";
import { levelSchema } from "../../../schemas/level";
import { dayDirectorySchema } from "../../../schemas/day";

import { dayDirectoryToNumber } from "./utils/transformDays";
import { createDayLessonPayload } from "./helpers/createDayLessonPayload";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { getNextDay } from "./utils/getNextDay";
import { useFeedback } from "../../contexts/FeedbackContext";
import { MarkdownEditor } from "../../components/MarkdownField";

export function DayForm() {
  const {
    language: languageParam,
    level: levelParam,
    day: dayParam,
  } = useParams();
  const { findProjectLine } = useProjectContent();

  const isUpdate = dayParam !== "new";

  const language = languageSchema.parse(languageParam);
  const level = levelSchema.parse(levelParam);
  const project = findProjectLine({ language, level });
  const dayDirectory = isUpdate
    ? dayDirectorySchema.parse(dayParam)
    : getNextDay(project?.days);

  const day = dayDirectoryToNumber(dayDirectory);

  // Project content exposes the files that actually exist for each day.
  // Keep navigation hidden for new days or files that are not available.
  const dayFiles = isUpdate
    ? project?.days?.find((item) => item.directory === dayDirectory)?.files
    : undefined;
  const hasLesson = dayFiles?.includes("lesson.json") ?? false;
  const hasDialogues = dayFiles?.includes("dialogues.json") ?? false;
  const dayRoute = `/project/${language}/${level}/days/${dayDirectory}`;

  const projectOptions = {
    language,
    level,
  };

  const { state, loading, updateField, updateLimit } = useDayForm(
    projectOptions,
    dayDirectory,
  );

  const { projectPath } = useProjectInfo();
  const { loadDaysContent } = useDaysContent();
  const navigate = useNavigate();

  const { showFeedback, clearFeedback } = useFeedback();
  const [saving, setSaving] = useState(false);

  const handleSaveDay = async () => {
    const dayLessonContent = createDayLessonPayload({
      day,
      dayDirectory,
      form: state,
      project,
    });

    try {
      setSaving(true);
      clearFeedback();

      if (isUpdate) {
        await window.rosewood.updateDayContent(
          projectPath,
          projectOptions,
          dayLessonContent,
        );
        await loadDaysContent(projectPath, projectOptions);
        showFeedback({ type: "success", message: "Day Updated" });
        navigate(`/project/${language}/${level}/days`);
      } else {
        await window.rosewood.createDayContent(
          projectPath,
          projectOptions,
          dayLessonContent,
        );
        await loadDaysContent(projectPath, projectOptions);
        showFeedback({ type: "success", message: "Day Created" });
        const { dayDirectory } = dayLessonContent;
        navigate(`/project/${language}/${level}/days/${dayDirectory}/lesson`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "API Error";
      showFeedback({ type: "error", message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-rosewood-ink bg-rosewood-surface shadow-[3px_3px_0_var(--color-rosewood-ink)]">
              <CalendarDays size={17} className="text-rosewood-accent" aria-hidden />
              <span className="mt-0.5 text-sm font-black tabular-nums">{String(day).padStart(2, "0")}</span>
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rosewood-accent">
                  Curriculum / Day editor
                </span>
                <span className="rounded-sm bg-rosewood-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {isUpdate ? "Editing" : "New"}
                </span>
              </div>
              <h1 className="text-2xl font-black leading-none text-rosewood-ink">
                {isUpdate ? `Day ${day}` : "Create a day"}
              </h1>
              <p className="mt-1 text-xs text-rosewood-ink/60">
                {language.toUpperCase()} <span className="px-1 text-rosewood-accent">◆</span> {level.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {hasLesson && (
              <Button
                variant="light"
                onClick={() => navigate(`${dayRoute}/lesson`)}
                disabled={saving}
                className="shrink-0"
                title="Open this day's lesson"
              >
                <BookOpenText size={17} aria-hidden />
                Lesson
              </Button>
            )}
            {hasDialogues && (
              <Button
                variant="light"
                onClick={() => navigate(`${dayRoute}/dialogues`)}
                disabled={saving}
                className="shrink-0"
                title="Open this day's dialogues"
              >
                <MessageSquareText size={17} aria-hidden />
                Dialogues
              </Button>
            )}
            <Button
              variant="accent"
              onClick={handleSaveDay}
              loading={saving}
              disabled={loading || saving}
              className="shrink-0"
            >
              {isUpdate ? "Save Changes" : "Create Day"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="h-full min-h-0 overflow-y-auto pr-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 pb-12">

          {/* EDITOR OVERVIEW */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-rosewood-ink/15 bg-rosewood-surface/70 px-5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white text-rosewood-accent">
                <ClipboardList size={19} aria-hidden />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-rosewood-ink">
                  {state.label?.trim() || "Untitled lesson day"}
                </p>
                <p className="mt-0.5 text-xs text-rosewood-ink/55">
                  {state.description?.trim() || "Set the focus and goals for this day"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rosewood-ink/60">
              <span className="rounded-full border border-rosewood-ink/15 bg-white px-3 py-1">
                {language}
              </span>
              <span className="rounded-full border border-rosewood-ink/15 bg-white px-3 py-1">
                {level}
              </span>
            </div>
          </div>

          {/* DAY IDENTITY */}
          <section aria-labelledby="day-identity-title" className="space-y-4">
            <div className="flex items-center gap-3 border-b border-rosewood-ink/15 pb-3">
              <span className="font-mono text-xs font-bold tracking-widest text-rosewood-accent">01</span>
              <div className="flex size-9 items-center justify-center rounded-md bg-rosewood-surface text-rosewood-ink">
                <NotebookPen size={19} aria-hidden />
              </div>
              <div>
                <h2 id="day-identity-title" className="text-lg font-extrabold leading-tight">Day identity</h2>
                <p className="text-xs text-rosewood-ink/55">Name and describe this day's content</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-xl border border-rosewood-ink/15 bg-white p-5 shadow-sm sm:grid-cols-[110px_minmax(0,1fr)]">
              <div className="min-w-0">
                <Input
                  id="day-number"
                  type="number"
                  readOnly
                  label="Day"
                  value={day}
                  className="w-full cursor-default bg-rosewood-ink/5 font-bold tabular-nums"
                />
              </div>
              <Input
                id="day-label"
                type="text"
                label="Lesson label"
                placeholder="e.g. Verb to be"
                value={state.label}
                onChange={(event) => updateField("label", event.target.value)}
              />
              <div className="sm:col-start-2">
                <Input
                  id="day-description"
                  type="text"
                  label="Short description"
                  placeholder="A quick summary of what the player will learn"
                  value={state.description}
                  onChange={(event) => updateField("description", event.target.value)}
                />
              </div>
            </div>
          </section>

          {/* LEARNING AND STORY TARGETS */}
          <section aria-labelledby="day-targets-title" className="space-y-4">
            <div className="flex items-center gap-3 border-b border-rosewood-ink/15 pb-3">
              <span className="font-mono text-xs font-bold tracking-widest text-rosewood-accent">02</span>
              <div className="flex size-9 items-center justify-center rounded-md bg-rosewood-surface text-rosewood-ink">
                <GraduationCap size={20} aria-hidden />
              </div>
              <div>
                <h2 id="day-targets-title" className="text-lg font-extrabold leading-tight">Daily objectives</h2>
                <p className="text-xs text-rosewood-ink/55">What the player learns and what happens in the story</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-rosewood-ink/20 bg-rosewood-surface/55 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-rosewood-ink/15 bg-white text-rosewood-accent">
                    <BookOpenText size={20} aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-extrabold">Learning targets</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-rosewood-ink/60">
                      Language goals, vocabulary, grammar and pronunciation
                    </p>
                  </div>
                </div>
                <TextArea
                  id="lesson-targets"
                  label=""
                  rows={5}
                  className="min-h-36 flex-1 bg-white"
                  placeholder="What should the player be able to say or understand?"
                  value={state.lessonTargets}
                  onChange={(event) => updateField("lessonTargets", event.target.value)}
                />
              </div>

              <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-rosewood-ink/20 bg-rosewood-surface/55 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-rosewood-ink/15 bg-white text-rosewood-accent">
                    <ScrollText size={20} aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-extrabold">Lore & rewards</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-rosewood-ink/60">
                      Story beats, character interactions and unlocks
                    </p>
                  </div>
                </div>
                <TextArea
                  id="lore-targets"
                  label=""
                  rows={5}
                  className="min-h-36 flex-1 bg-white"
                  placeholder="Which story events or rewards belong to this day?"
                  value={state.loreTargets}
                  onChange={(event) => updateField("loreTargets", event.target.value)}
                />
              </div>
            </div>
          </section>

          {/* EXERCISE LIMITS */}
          <section aria-labelledby="day-limits-title" className="space-y-4">
            <div className="flex items-center gap-3 border-b border-rosewood-ink/15 pb-3">
              <span className="font-mono text-xs font-bold tracking-widest text-rosewood-accent">03</span>
              <div className="flex size-9 items-center justify-center rounded-md bg-rosewood-surface text-rosewood-ink">
                <Settings2 size={19} aria-hidden />
              </div>
              <div>
                <h2 id="day-limits-title" className="text-lg font-extrabold leading-tight">Challenge settings</h2>
                <p className="text-xs text-rosewood-ink/55">Recording duration, error tolerance and success threshold</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <section className="min-w-0 rounded-xl border border-rosewood-ink/15 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Clock3 size={20} className="text-rosewood-accent" aria-hidden />
                  <div>
                    <h3 className="font-extrabold">Pronunciation</h3>
                    <p className="text-xs text-rosewood-ink/55">Recording duration · ms</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    id="pronunciation-min"
                    type="number"
                    label="Minimum"
                    min={0}
                    value={state.limits.pronunciation.minimumRecordTime}
                    onChange={(event) => updateLimit(
                      "pronunciation", "minimumRecordTime", Number(event.target.value),
                    )}
                  />
                  <Input
                    id="pronunciation-max"
                    type="number"
                    label="Maximum"
                    min={0}
                    value={state.limits.pronunciation.maximumRecordTime}
                    onChange={(event) => updateLimit(
                      "pronunciation", "maximumRecordTime", Number(event.target.value),
                    )}
                  />
                </div>
              </section>

              <section className="min-w-0 rounded-xl border border-rosewood-ink/15 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Sparkles size={20} className="text-rosewood-accent" aria-hidden />
                  <div>
                    <h3 className="font-extrabold">Writing</h3>
                    <p className="text-xs text-rosewood-ink/55">Mistakes and available hints</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    id="writing-errors"
                    type="number"
                    label="Errors"
                    min={0}
                    value={state.limits.writing.totalErrors}
                    onChange={(event) => updateLimit(
                      "writing", "totalErrors", Number(event.target.value),
                    )}
                  />
                  <Input
                    id="writing-tips"
                    type="number"
                    label="Tips"
                    min={0}
                    value={state.limits.writing.totalTips}
                    onChange={(event) => updateLimit(
                      "writing", "totalTips", Number(event.target.value),
                    )}
                  />
                </div>
              </section>

              <section className="min-w-0 rounded-xl border border-rosewood-ink/15 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <ShieldCheck size={20} className="text-rosewood-accent" aria-hidden />
                  <div>
                    <h3 className="font-extrabold">Lesson entry</h3>
                    <p className="text-xs text-rosewood-ink/55">Minimum success requirement</p>
                  </div>
                </div>
                <Input
                  id="entry-minimum-success"
                  type="number"
                  label="Success threshold"
                  min={0}
                  max={1}
                  step="0.1"
                  value={state.limits.entry.minimumSuccessPercentage}
                  onChange={(event) => updateLimit(
                    "entry", "minimumSuccessPercentage", Number(event.target.value),
                  )}
                />
                <p className="mt-2 text-xs text-rosewood-ink/50">
                  Enter a value between 0 and 1
                </p>
              </section>
            </div>
          </section>

          {/* OPTIONAL PROJECT REFERENCE */}
          <details className="group rounded-xl border border-rosewood-ink/15 bg-rosewood-surface/45">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
              <div className="flex items-center gap-3">
                <Settings2 size={18} className="text-rosewood-accent" aria-hidden />
                <div>
                  <h2 className="font-extrabold">Language & level reference</h2>
                  <p className="text-xs text-rosewood-ink/55">Project information · Read only</p>
                </div>
              </div>
              <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <div className="space-y-4 border-t border-rosewood-ink/15 px-5 py-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: "Language", value: project?.language ?? "—" },
                  { label: "Level", value: project?.level ?? "—" },
                  { label: "Planned days", value: project?.plannedDays ?? "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-rosewood-ink/10 bg-white px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-rosewood-ink/45">{label}</p>
                    <p className="mt-1 font-extrabold">{value}</p>
                  </div>
                ))}
              </div>
              {project?.lessonPlan && (
                <details className="rounded-lg border border-rosewood-ink/15 bg-white">
                  <summary className="cursor-pointer px-4 py-3 text-sm font-bold">Lesson plan</summary>
                  <div className="border-t border-rosewood-ink/10 p-4">
                    <MarkdownEditor disabled value={project.lessonPlan} onChange={() => {}} />
                  </div>
                </details>
              )}
              {project?.lore && (
                <details className="rounded-lg border border-rosewood-ink/15 bg-white">
                  <summary className="cursor-pointer px-4 py-3 text-sm font-bold">Lore</summary>
                  <div className="border-t border-rosewood-ink/10 p-4">
                    <MarkdownEditor disabled value={project.lore} onChange={() => {}} />
                  </div>
                </details>
              )}
            </div>
          </details>
        </div>
      </div>
    </Panel>
  );
}

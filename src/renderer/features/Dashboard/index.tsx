import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Layers3,
  Plus,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Panel } from "../../components/Panel";
import { Avatar } from "../../components/Avatar";
import { useProjectContent } from "../../contexts/ProjectContentContext";
import { useProjectInfo } from "../../contexts/ProjectInfoContext";
import { LANGUAGE_DETAILS } from "../../../constants";
import type { CharacterProfile } from "../../../schemas/characterProfile";
import type { ProjectContent } from "../../../schemas/project";

function progressPercent(created: number, planned: number): number {
  if (planned <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((created / planned) * 100)));
}

function plainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function SectionHeading({
  eyebrow,
  title,
  count,
  onViewAll,
}: {
  eyebrow: string;
  title: string;
  count: number;
  onViewAll: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-rosewood-ink/15 pb-4">
      <div>
        <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.23em] text-rosewood-accent">
          {eyebrow}
        </p>
        <h2 className="font-serif text-2xl font-bold tracking-tight text-rosewood-ink">
          {title} <span className="align-middle font-sans text-sm font-normal text-rosewood-ink/45">({count})</span>
        </h2>
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rosewood-ink transition-colors hover:text-rosewood-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rosewood-accent"
      >
        View all <ArrowRight size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

function LessonPreview({
  lesson,
  onOpen,
}: {
  lesson: ProjectContent;
  onOpen: () => void;
}) {
  const percentage = progressPercent(lesson.createdDays, lesson.plannedDays);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full flex-col gap-4 rounded-lg border-2 border-rosewood-ink bg-rosewood-surface p-5 text-left shadow-[4px_4px_0_var(--color-rosewood-ink)] transition-transform hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rosewood-accent"
    >
      <div className="flex w-full items-start justify-between gap-4">
        <span className="inline-flex rounded-sm border border-rosewood-ink bg-rosewood-ink px-2.5 py-1 font-mono text-xs font-bold text-white">
          {lesson.level}
        </span>
        <ArrowUpRight size={18} className="text-rosewood-ink/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-rosewood-accent" aria-hidden="true" />
      </div>
      <div>
        <h3 className="font-serif text-xl font-bold leading-tight text-rosewood-ink">
          {LANGUAGE_DETAILS[lesson.language].name}
        </h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-rosewood-ink/50">
          {lesson.language} / {lesson.level}
        </p>
      </div>
      <div className="mt-auto w-full border-t border-rosewood-ink/15 pt-4">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs">
          <span className="text-rosewood-ink/65">
            {lesson.createdDays} of {lesson.plannedDays} days
          </span>
          <strong className="font-mono text-rosewood-ink">{percentage}%</strong>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-rosewood-ink/10"
          role="progressbar"
          aria-label={`${LANGUAGE_DETAILS[lesson.language].name} ${lesson.level} completion`}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-rosewood-accent transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </button>
  );
}

function CharacterPreview({
  character,
  onOpen,
}: {
  character: CharacterProfile;
  onOpen: () => void;
}) {
  const name = character.displayName?.trim() || character.name;
  const description = plainText(character.description);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full items-center gap-4 rounded-lg border border-rosewood-ink/20 bg-rosewood-paper p-3 text-left transition-colors hover:border-rosewood-accent hover:bg-rosewood-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rosewood-accent"
    >
      <Avatar name={name} size="lg" className="!shadow-none" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-serif text-lg font-bold leading-tight text-rosewood-ink">
          {name}
        </span>
        <span className="mt-1 block truncate text-xs text-rosewood-ink/60">
          {description || character.id}
        </span>
      </span>
      <ArrowUpRight
        size={17}
        className="shrink-0 text-rosewood-ink/40 group-hover:text-rosewood-accent"
        aria-hidden="true"
      />
    </button>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const { connected } = useProjectInfo();
  const { projectContent, loading, error } = useProjectContent();

  const lessons = projectContent?.lines ?? [];
  const characters = projectContent?.characters ?? [];
  const languages = new Set(lessons.map((lesson) => lesson.language)).size;
  const createdDays = lessons.reduce((sum, lesson) => sum + lesson.createdDays, 0);
  const plannedDays = lessons.reduce((sum, lesson) => sum + lesson.plannedDays, 0);
  const completion = progressPercent(createdDays, plannedDays);
  const canOpen = connected && !!projectContent;

  return (
    <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="h-full min-h-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-3">
          {/* Opening editorial */}
          <header className="relative overflow-hidden rounded-lg border-2 border-rosewood-ink bg-rosewood-ink px-6 py-7 text-white sm:px-8 sm:py-9">
            <span aria-hidden="true" className="pointer-events-none absolute -right-6 -top-20 select-none font-serif text-[270px] font-bold leading-none text-white/5">
              R
            </span>
            <div className="relative">
              <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-rosewood-surface/65">
                Rosewood / Workspace overview
              </p>
              <h1 className="max-w-2xl font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Your story, <span className="italic text-rosewood-surface/80">at a glance.</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
                One place for your lessons, characters and everything taking shape.
              </p>
            </div>
          </header>

          {!connected ? (
            <p className="rounded-lg border border-rosewood-ink/20 bg-rosewood-paper p-6 text-rosewood-ink">
              Connect a project to see its overview.
            </p>
          ) : error ? (
            <p role="alert" className="rounded-lg border border-rosewood-accent bg-rosewood-paper p-6 text-rosewood-accent">
              {error}
            </p>
          ) : !projectContent ? (
            <p className="rounded-lg border border-rosewood-ink/20 bg-rosewood-paper p-6 text-rosewood-ink">
              {loading ? "Loading your workspace..." : "No project content available."}
            </p>
          ) : (
            <>
              {/* Summary strip */}
              <section aria-label="Project statistics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {[
                  { label: "Languages", value: languages, icon: Layers3 },
                  { label: "Lesson tracks", value: lessons.length, icon: BookOpen },
                  { label: "Characters", value: characters.length, icon: UsersRound },
                  { label: "Days created", value: createdDays, icon: CalendarDays },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="relative flex min-h-28 flex-col justify-between overflow-hidden rounded-lg border border-rosewood-ink/20 bg-rosewood-paper p-4 sm:p-5">
                    <Icon size={18} className="absolute right-4 top-4 text-rosewood-accent" aria-hidden="true" />
                    <p className="pr-6 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-rosewood-ink/60">{label}</p>
                    <strong className="mt-4 font-serif text-4xl font-bold leading-none text-rosewood-ink">{value}</strong>
                  </div>
                ))}
              </section>

              <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
                {/* Lessons */}
                <section className="min-w-0">
                  <SectionHeading
                    eyebrow="01 / Curriculum"
                    title="Lessons"
                    count={lessons.length}
                    onViewAll={() => navigate("/project")}
                  />
                  {lessons.length ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {lessons.slice(0, 4).map((lesson) => (
                        <LessonPreview
                          key={`${lesson.language}-${lesson.level}`}
                          lesson={lesson}
                          onOpen={() => navigate(`/project/${encodeURIComponent(lesson.language)}/${encodeURIComponent(lesson.level)}/days`)}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-lg border border-dashed border-rosewood-ink/30 p-6 text-sm text-rosewood-ink/60">
                      No lesson tracks yet.
                    </p>
                  )}
                  <button
                    type="button"
                    disabled={!canOpen}
                    onClick={() => navigate("/project/new")}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-rosewood-ink/35 px-4 py-3 text-xs font-bold uppercase tracking-wider text-rosewood-ink transition-colors hover:border-rosewood-accent hover:text-rosewood-accent disabled:opacity-50"
                  >
                    <Plus size={15} aria-hidden="true" /> New language / level
                  </button>
                </section>

                {/* Characters */}
                <section className="min-w-0">
                  <SectionHeading
                    eyebrow="02 / Cast"
                    title="Characters"
                    count={characters.length}
                    onViewAll={() => navigate("/characters")}
                  />
                  <div className="rounded-lg border-2 border-rosewood-ink bg-rosewood-surface p-4 shadow-[5px_5px_0_var(--color-rosewood-ink)] sm:p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.17em] text-rosewood-ink/55">
                        Character archive
                      </span>
                      <span className="size-2 rotate-45 bg-rosewood-accent" aria-hidden="true" />
                    </div>
                    {characters.length ? (
                      <div className="flex flex-col gap-3">
                        {characters.slice(0, 4).map((character) => (
                          <CharacterPreview
                            key={character.id}
                            character={character}
                            onOpen={() => navigate(`/characters/${encodeURIComponent(character.id)}`)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="py-8 text-center text-sm text-rosewood-ink/60">
                        No characters created yet.
                      </p>
                    )}
                    <button
                      type="button"
                      disabled={!canOpen}
                      onClick={() => navigate("/characters/new")}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-rosewood-ink px-4 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-rosewood-accent disabled:opacity-50"
                    >
                      <Plus size={15} aria-hidden="true" /> Create character
                    </button>
                  </div>
                </section>
              </div>

              {/* Cross-workspace progress */}
              <section className="grid gap-5 rounded-lg border border-rosewood-ink/20 bg-rosewood-paper p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rosewood-accent">
                    Curriculum progress
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-rosewood-ink">
                    {createdDays} <span className="font-normal text-rosewood-ink/50">/ {plannedDays} planned days</span>
                  </h2>
                  <div className="mt-4 h-2.5 w-full max-w-xl overflow-hidden rounded-full bg-rosewood-ink/10" role="progressbar" aria-label="Overall curriculum completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion}>
                    <div className="h-full rounded-full bg-rosewood-accent" style={{ width: `${completion}%` }} />
                  </div>
                </div>
                <strong className="font-serif text-5xl font-bold text-rosewood-ink sm:text-6xl">{completion}%</strong>
              </section>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

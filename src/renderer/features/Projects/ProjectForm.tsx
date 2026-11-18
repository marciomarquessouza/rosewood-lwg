import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  BookOpenText,
  FileText,
  Globe2,
  Languages,
  Layers3,
  Plus,
  ScrollText,
  Trash2,
} from "lucide-react";

import { Panel } from "../../components/Panel";
import { LANGUAGE_DETAILS } from "../../../constants";
import { Language } from "../../../schemas/language";
import { Level } from "../../../schemas/level";
import { useProjectForm } from "./hooks/useProjectForm";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Feedback } from "../../components/Feedback";
import { MarkdownEditor } from "../../components/MarkdownField";

export function ProjectForm() {
  const { language: languageParam, level: levelParam } = useParams();

  const language = languageParam as Language | undefined;
  const level = levelParam as Level | undefined;

  const isUpdate = Boolean(language && level);
  const {
    state,
    loading,
    setField,
    setLanguage,
    addLocale,
    removeLocale,
    supportedLocales,
    supportedLanguages,
    supportedLevels,
    handleSubmit,
  } = useProjectForm({
    projectLevel: level,
    projectLng: language,
    isUpdate,
  });
  const submitRef = useRef(handleSubmit);

  useEffect(() => {
    submitRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();

        if (!event.repeat && !loading) {
          void submitRef.current();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [loading]);

  return (
    <Panel className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border-2 border-rosewood-ink bg-rosewood-surface text-rosewood-accent shadow-[3px_3px_0_var(--color-rosewood-ink)]">
              <Languages size={26} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-rosewood-accent">
                  Curriculum / Track editor
                </span>
                <span className="rounded-sm bg-rosewood-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {isUpdate ? "Editing" : "New"}
                </span>
              </div>
              <h1 className="font-serif text-2xl font-bold leading-tight text-rosewood-ink">
                {isUpdate ? LANGUAGE_DETAILS[state.language].name : "Create a lesson track"}
              </h1>
              <p className="mt-1 text-xs text-rosewood-ink/60">
                {state.language} <span className="px-1 text-rosewood-accent">◆</span> {state.level || "Choose a level"}
              </p>
            </div>
          </div>
          <Button loading={loading} disabled={loading} onClick={handleSubmit} variant="accent">
            {isUpdate ? "Save Changes" : "Create Track"}
          </Button>
        </div>
      }
    >
      <div className="h-full min-h-0 overflow-y-auto pr-1">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-10">

          {/* TRACK IDENTITY */}
          <section aria-labelledby="track-details-heading" className="space-y-4">
            <div className="flex items-center gap-3 border-b border-rosewood-ink/15 pb-3">
              <span className="font-mono text-xs font-bold tracking-widest text-rosewood-accent">01</span>
              <div className="flex size-9 items-center justify-center rounded-md bg-rosewood-surface">
                <Globe2 size={19} aria-hidden="true" />
              </div>
              <div>
                <h2 id="track-details-heading" className="text-lg font-extrabold leading-tight">Track details</h2>
                <p className="text-xs text-rosewood-ink/55">Define the language, level and curriculum length</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-rosewood-ink/15 bg-white p-5 shadow-sm sm:grid-cols-3">
              <div className="min-w-0">
                {isUpdate ? (
                  <Input
                    id="language"
                    type="text"
                    label="Language"
                    readOnly
                    className="w-full bg-rosewood-ink/5"
                    value={LANGUAGE_DETAILS[state.language].name}
                  />
                ) : (
                  <Select
                    id="language"
                    label="Language"
                    className="w-full"
                    value={state.language}
                    onChange={(event) => setLanguage(event.target.value as Language)}
                    options={supportedLanguages}
                  />
                )}
              </div>
              <div className="min-w-0">
                {isUpdate ? (
                  <Input
                    id="level"
                    label="Level"
                    readOnly
                    value={state.level}
                    className="w-full bg-rosewood-ink/5"
                  />
                ) : (
                  <Select
                    id="level"
                    label="Level"
                    className="w-full"
                    value={state.level ?? ""}
                    onChange={(event) => setField("level", event.target.value as Level)}
                    options={supportedLevels}
                  />
                )}
              </div>
              <div className="min-w-0">
                <Input
                  id="plannedDays"
                  type="number"
                  min={1}
                  className="w-full"
                  label="Planned days"
                  value={state.plannedDays}
                  error={state.errors.plannedDays}
                  onChange={(event) => setField("plannedDays", Number(event.target.value))}
                />
              </div>
            </div>
          </section>

          {/* LESSON PLAN */}
          <section aria-labelledby="track-plan-heading" className="space-y-4">
            <div className="flex items-center gap-3 border-b border-rosewood-ink/15 pb-3">
              <span className="font-mono text-xs font-bold tracking-widest text-rosewood-accent">02</span>
              <div className="flex size-9 items-center justify-center rounded-md bg-rosewood-surface">
                <BookOpenText size={19} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="track-plan-heading" className="text-lg font-extrabold leading-tight">Lesson plan</h2>
                <p className="text-xs text-rosewood-ink/55">
                  Outline the curriculum, learning objectives and knowledge entries
                </p>
              </div>
              <span className="hidden rounded-sm border border-rosewood-ink/15 bg-rosewood-paper px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-rosewood-ink/60 sm:inline-flex">
                <FileText size={13} className="mr-1.5" aria-hidden="true" /> Markdown
              </span>
            </div>
            <div className="min-w-0 overflow-hidden rounded-xl border border-rosewood-ink/15 bg-white p-4 shadow-sm sm:p-5">
              {state.errors.lessonPlan && (
                <div className="mb-3"><Feedback variant="error">{state.errors.lessonPlan}</Feedback></div>
              )}
              <div className="min-w-0">
                <MarkdownEditor
                  className="project-track-editor"
                  value={state.lessonPlan}
                  onChange={(value) => setField("lessonPlan", value)}
                  placeholder="Describe the curriculum for this language and level..."
                />
              </div>
            </div>
          </section>

          {/* LORE */}
          <section aria-labelledby="track-lore-heading" className="space-y-4">
            <div className="flex items-center gap-3 border-b border-rosewood-ink/15 pb-3">
              <span className="font-mono text-xs font-bold tracking-widest text-rosewood-accent">03</span>
              <div className="flex size-9 items-center justify-center rounded-md bg-rosewood-surface">
                <ScrollText size={19} aria-hidden="true" />
              </div>
              <div>
                <h2 id="track-lore-heading" className="text-lg font-extrabold leading-tight">Lore & narrative</h2>
                <p className="text-xs text-rosewood-ink/55">Story context, narrative themes and character progression</p>
              </div>
            </div>
            <div className="min-w-0 rounded-xl border border-rosewood-ink/15 bg-rosewood-surface/40 p-4 sm:p-5">
              {state.errors.lore && (
                <div className="mb-3"><Feedback variant="error">{state.errors.lore}</Feedback></div>
              )}
              <MarkdownEditor
                className="project-track-editor"
                value={state.lore}
                onChange={(value) => setField("lore", value)}
                placeholder="Describe the narrative context of this track..."
              />
            </div>
          </section>

          {/* LOCALES */}
          <section aria-labelledby="track-locales-heading" className="space-y-4">
            <div className="flex items-center gap-3 border-b border-rosewood-ink/15 pb-3">
              <span className="font-mono text-xs font-bold tracking-widest text-rosewood-accent">04</span>
              <div className="flex size-9 items-center justify-center rounded-md bg-rosewood-surface">
                <Layers3 size={19} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="track-locales-heading" className="text-lg font-extrabold leading-tight">Player locales</h2>
                <p className="text-xs text-rosewood-ink/55">Languages used to translate the learning content</p>
              </div>
              <span className="rounded-full border border-rosewood-ink/15 bg-rosewood-paper px-3 py-1 text-xs font-bold tabular-nums">
                {state.locales.length} {state.locales.length === 1 ? "locale" : "locales"}
              </span>
            </div>
            <div className="space-y-4 rounded-xl border border-rosewood-ink/15 bg-white p-5 shadow-sm">
              {supportedLocales.length > 0 && (
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-44 flex-1 sm:max-w-xs">
                    <Select
                      id="locale"
                      label="Add locale"
                      className="w-full"
                      value={state.selectedLocale ?? ""}
                      onChange={(event) => setField("selectedLocale", event.target.value as Language)}
                      options={supportedLocales}
                    />
                  </div>
                  <Button
                    variant="dark"
                    disabled={!state.selectedLocale}
                    onClick={() => {
                      if (state.selectedLocale) addLocale(state.selectedLocale);
                    }}
                  >
                    <Plus size={16} aria-hidden="true" /> Add Locale
                  </Button>
                </div>
              )}
              {state.errors.locales && <Feedback variant="error">{state.errors.locales}</Feedback>}
              {state.locales.length ? (
                <ul className="flex flex-wrap gap-2" aria-label="Selected player locales">
                  {state.locales.map((locale) => (
                    <li key={locale}>
                      <div className="flex items-center gap-2 rounded-md border border-rosewood-ink/20 bg-rosewood-paper py-2 pl-3 pr-2">
                        <span className="font-mono text-xs font-bold">{locale}</span>
                        <span className="max-w-36 truncate text-xs text-rosewood-ink/60">
                          {LANGUAGE_DETAILS[locale].name}
                        </span>
                        <button
                          type="button"
                          aria-label={`Remove locale ${locale}`}
                          title={`Remove ${locale}`}
                          onClick={() => removeLocale(locale)}
                          className="rounded p-1 text-rosewood-ink/50 transition-colors hover:bg-rosewood-accent/10 hover:text-rosewood-accent focus-visible:outline-2 focus-visible:outline-rosewood-accent"
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-md border border-dashed border-rosewood-ink/20 px-4 py-5 text-sm text-rosewood-ink/55">
                  No player locales selected.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </Panel>
  );
}

import { useParams } from "react-router-dom";
import { Panel } from "../../components/Panel";
import { LANGUAGE_DETAILS } from "../../../constants";
import { Language } from "../../../schemas/language";
import { Level } from "../../../schemas/level";
import { useProjectForm } from "./hooks/useProjectForm";
import { Button } from "../../components/Button";
import { Collapsible } from "../../components/Collapsible";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Pill } from "../../components/Pill";
import { Feedback } from "../../components/Feedback";
import { MarkdownEditor } from "../../components/MarkdownField";
import { useEffect, useRef } from "react";

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
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold">Language/Level</p>
          <div>
            <Button loading={loading} onClick={handleSubmit} variant="accent">
              {isUpdate ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="h-full overflow-y-auto">
        <div className="flex flex-col gap-4">
          <Collapsible title="Details">
            <div className="flex flex-col gap-3 pl-4">
              <div className=" flex flex-row gap-2">
                <div id="language" className=" w-40">
                  {isUpdate ? (
                    <Input
                      type="text"
                      labelVariant="accent"
                      readOnly
                      className="w-38"
                      label="Language:"
                      value={LANGUAGE_DETAILS[state.language].name}
                    />
                  ) : (
                    <Select
                      id="language"
                      label="Language"
                      value={state.language}
                      className="w-38"
                      onChange={(event) =>
                        setLanguage(event.target.value as Language)
                      }
                      options={supportedLanguages}
                    />
                  )}
                </div>
                <div id="level" className="w-32">
                  {isUpdate ? (
                    <Input
                      type="text"
                      labelVariant="accent"
                      readOnly
                      className="w-18"
                      label="Level:"
                      value={state.level}
                    />
                  ) : (
                    <Select
                      id="Level"
                      label="Level"
                      value={state.level ?? ""}
                      className="w-28"
                      onChange={(event) =>
                        setField("level", event.target.value as Level)
                      }
                      options={supportedLevels}
                    />
                  )}
                </div>
                <div id="plannedDays" className="w-32">
                  <Input
                    type="number"
                    className="w-18"
                    label="Planned Days:"
                    value={state.plannedDays}
                    error={state.errors.plannedDays}
                    onChange={(event) =>
                      setField("plannedDays", Number(event.target.value))
                    }
                  />
                </div>
              </div>

              <div>
                <label>Planned Lessons</label>
                {state.errors.lessonPlan && (
                  <Feedback variant="error">
                    {state.errors.lessonPlan} =
                  </Feedback>
                )}
                <MarkdownEditor
                  value={state.lessonPlan}
                  onChange={(value) => setField("lessonPlan", value)}
                  placeholder="Write overview outline here..."
                />
              </div>

              <div>
                <label>Lore</label>
                {state.errors.lore && (
                  <Feedback variant="error">{state.errors.lore} =</Feedback>
                )}
                <MarkdownEditor
                  value={state.lore}
                  onChange={(value) => setField("lore", value)}
                  placeholder="Write overview outline here..."
                />
              </div>
            </div>
          </Collapsible>
          <Collapsible title="Locales">
            {supportedLocales.length > 0 && (
              <div className="flex flex-row gap-3 pl-4 items-center">
                <Select
                  id="locale"
                  label="Locale"
                  value={state.selectedLocale ?? ""}
                  className="w-48"
                  onChange={(event) =>
                    setField("selectedLocale", event.target.value as Language)
                  }
                  options={supportedLocales}
                />
                <div className="flex mt-6">
                  <Button
                    variant="accent"
                    disabled={!state.selectedLocale}
                    onClick={() => {
                      if (state.selectedLocale) {
                        addLocale(state.selectedLocale);
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
            {state.errors.locales && (
              <Feedback variant="error">{state.errors.locales}</Feedback>
            )}
            <ul className="flex flex-row my-2 pl-4 gap-2">
              {state.locales.map((locale) => (
                <li key={locale}>
                  <button onClick={() => removeLocale(locale)}>
                    <Pill variant="dark">{locale}</Pill>
                  </button>
                </li>
              ))}
            </ul>
          </Collapsible>
        </div>
      </div>
    </Panel>
  );
}

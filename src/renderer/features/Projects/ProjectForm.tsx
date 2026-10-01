import { useParams } from "react-router-dom";
import { Panel } from "../../components/Panel";
import { LANGUAGE_DETAILS } from "../../../constants";
import { Language } from "../../../schemas/language";
import { TextArea } from "../../components/TextArea";
import { Level } from "../../../schemas/level";
import { useProjectForm } from "./hook/useProjectForm";
import { Button } from "../../components/Button";
import { Collapsible } from "../../components/Collapsible";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { Pill } from "../../components/Pill";

export function ProjectForm() {
  const params = useParams();
  const language = params ? (params["language"] as Language) : null;
  const level = params ? (params["level"] as Level) : null;
  const isUpdate = !!(language && level);
  const {
    state,
    setField,
    addLocale,
    removeLocale,
    supportedLocales,
    supportedLanguages,
    supportedLevels,
  } = useProjectForm({
    projectLevel: level,
    projectLng: language,
    isUpdate,
  });

  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold">
            {isUpdate
              ? `${level} ${LANGUAGE_DETAILS[language].name} [${language}]`
              : "New Project"}
          </p>
          <div>
            <Button variant="accent">
              {isUpdate ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      }
    >
      <div className="h-full overflow-y-auto">
        <div className="flex flex-col gap-4">
          <Collapsible title="Details">
            <form className="flex flex-col gap-3 pl-4">
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
                      value={state.language ?? ""}
                      className="w-38"
                      onChange={(event) =>
                        setField("language", event.target.value as Language)
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
                    onChange={(event) =>
                      setField("plannedDays", Number(event.target.value))
                    }
                  />
                </div>
              </div>

              <TextArea
                id="description"
                label="Description"
                placeholder="Write overview outline here..."
                value={state.description}
                onChange={(event) =>
                  setField("description", event.target.value)
                }
              />
              <TextArea
                id="lore"
                label="Lore"
                placeholder="Write overview outline here..."
                value={state.lore}
                onChange={(event) => setField("lore", event.target.value)}
              />
              <TextArea
                id="lesson-plan"
                label="Planned Lessons"
                placeholder="Write overview outline here..."
                value={state.lessonPlan}
                onChange={(event) => setField("lessonPlan", event.target.value)}
              />
            </form>
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

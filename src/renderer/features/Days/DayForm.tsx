/* eslint-disable @typescript-eslint/no-empty-function */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Panel } from "../../components/Panel";
import { Button } from "../../components/Button";
import { Collapsible } from "../../components/Collapsible";
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
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-2xl font-bold">
              {isUpdate ? `Day ${day}` : "New Day"}
            </p>
            <p className="text-sm text-rosewood-ink/60">
              {language.toUpperCase()} / {level.toUpperCase()}
            </p>
          </div>

          <Button
            variant="accent"
            onClick={handleSaveDay}
            disabled={loading || saving}
          >
            {saving ? "Saving..." : isUpdate ? "Save Changes" : "Create"}
          </Button>
        </div>
      }
    >
      <div className="h-full min-h-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 pb-8">
          {/* DAY DETAILS */}
          <Collapsible title="Day Details">
            <div className="flex flex-col gap-6 px-2 py-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[100px_1fr_1fr]">
                <Input type="number" readOnly label="Day" value={day} />

                <Input
                  type="text"
                  label="Label"
                  value={state.label}
                  onChange={(event) => updateField("label", event.target.value)}
                />

                <Input
                  type="text"
                  label="Description"
                  value={state.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                />
              </div>

              <div className="border-t border-rosewood-ink/15" />

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-2">
                  <div>
                    <h3 className="font-semibold text-rosewood-ink">
                      Lesson Targets
                    </h3>
                    <p className="text-xs text-rosewood-ink/60">
                      Linguistic goals, vocabulary and pronunciation
                    </p>
                  </div>

                  <TextArea
                    id="lesson-targets"
                    label=""
                    placeholder="Define the linguistic goals for this day..."
                    value={state.lessonTargets}
                    onChange={(event) =>
                      updateField("lessonTargets", event.target.value)
                    }
                  />
                </div>

                <div className="flex min-w-0 flex-col gap-2">
                  <div>
                    <h3 className="font-semibold text-rosewood-ink">
                      Lore & Rewards
                    </h3>
                    <p className="text-xs text-rosewood-ink/60">
                      Narrative triggers, interactions and unlocks
                    </p>
                  </div>

                  <TextArea
                    id="lore-targets"
                    label=""
                    placeholder="Define narrative events and rewards..."
                    value={state.loreTargets}
                    onChange={(event) =>
                      updateField("loreTargets", event.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </Collapsible>

          {/* LESSON LIMITS */}
          <Collapsible title="Lesson Limits">
            <div className="grid grid-cols-1 gap-4 px-2 py-3 md:grid-cols-2">
              {/* PRONUNCIATION */}
              <section className="min-w-0 rounded-lg border border-rosewood-ink/20 bg-rosewood-surface p-4">
                <div className="mb-4">
                  <h3 className="font-bold text-rosewood-accent">
                    Pronunciation
                  </h3>
                  <p className="mt-1 text-xs text-rosewood-ink/60">
                    Audio recording duration limits
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    type="number"
                    label="Minimum (ms)"
                    value={state.limits.pronunciation.minimumRecordTime}
                    onChange={(event) =>
                      updateLimit(
                        "pronunciation",
                        "minimumRecordTime",
                        Number(event.target.value),
                      )
                    }
                  />

                  <Input
                    type="number"
                    label="Maximum (ms)"
                    value={state.limits.pronunciation.maximumRecordTime}
                    onChange={(event) =>
                      updateLimit(
                        "pronunciation",
                        "maximumRecordTime",
                        Number(event.target.value),
                      )
                    }
                  />
                </div>
              </section>

              {/* WRITING */}
              <section className="min-w-0 rounded-lg border border-rosewood-ink/20 bg-rosewood-surface p-4">
                <div className="mb-4">
                  <h3 className="font-bold text-rosewood-accent">Writing</h3>
                  <p className="mt-1 text-xs text-rosewood-ink/60">
                    Error tolerance and available hints
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    type="number"
                    label="Total Errors"
                    value={state.limits.writing.totalErrors}
                    onChange={(event) =>
                      updateLimit(
                        "writing",
                        "totalErrors",
                        Number(event.target.value),
                      )
                    }
                  />

                  <Input
                    type="number"
                    label="Total Tips"
                    value={state.limits.writing.totalTips}
                    onChange={(event) =>
                      updateLimit(
                        "writing",
                        "totalTips",
                        Number(event.target.value),
                      )
                    }
                  />
                </div>
              </section>

              {/* LESSON ENTRY */}
              <section className="min-w-0 rounded-lg border border-rosewood-ink/20 bg-rosewood-surface p-4">
                <div className="mb-4">
                  <h3 className="font-bold text-rosewood-accent">
                    Lesson Entry
                  </h3>
                  <p className="mt-1 text-xs text-rosewood-ink/60">
                    Minimum success threshold
                  </p>
                </div>

                <div className="max-w-52">
                  <Input
                    type="number"
                    label="Minimum Success"
                    placeholder="0.6"
                    step="0.1"
                    value={state.limits.entry.minimumSuccessPercentage}
                    onChange={(event) =>
                      updateLimit(
                        "entry",
                        "minimumSuccessPercentage",
                        Number(event.target.value),
                      )
                    }
                  />
                </div>
              </section>
            </div>
          </Collapsible>

          {/* PROJECT REFERENCE */}
          <Collapsible title="Language/Level Details" defaultOpen={false}>
            <div className="flex flex-col gap-4 px-2 py-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-md bg-rosewood-surface p-3">
                  <p className="text-xs text-rosewood-ink/60">Language</p>
                  <p className="mt-1 font-semibold text-rosewood-ink">
                    {project?.language ?? "—"}
                  </p>
                </div>

                <div className="rounded-md bg-rosewood-surface p-3">
                  <p className="text-xs text-rosewood-ink/60">Level</p>
                  <p className="mt-1 font-semibold text-rosewood-ink">
                    {project?.level ?? "—"}
                  </p>
                </div>

                <div className="rounded-md bg-rosewood-surface p-3">
                  <p className="text-xs text-rosewood-ink/60">Planned Days</p>
                  <p className="mt-1 font-semibold text-rosewood-ink">
                    {project?.plannedDays ?? "—"}
                  </p>
                </div>
              </div>

              {project?.lessonPlan && (
                <Collapsible title="Lesson Plan" defaultOpen={false}>
                  <MarkdownEditor
                    disabled
                    value={project.lessonPlan}
                    onChange={() => {}}
                  />
                </Collapsible>
              )}

              {project?.lore && (
                <Collapsible title="Lore" defaultOpen={false}>
                  <MarkdownEditor
                    disabled
                    value={project.lore}
                    onChange={() => {}}
                  />
                </Collapsible>
              )}
            </div>
          </Collapsible>
        </div>
      </div>
    </Panel>
  );
}

import { useState } from "react";
import { useParams } from "react-router-dom";

import { Panel } from "../../components/Panel";
import { Button } from "../../components/Button";
import { Collapsible } from "../../components/Collapsible";
import { Input } from "../../components/Input";
import { TextArea } from "../../components/TextArea";
import { Feedback } from "../../components/Feedback";

import { LessonEntries } from "../LessonEntries/LessonEntries";
import { DialogueList } from "../Dialogues/DialogueList";

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

  const [apiError, setApiError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveDay = async () => {
    const dayLessonContent = createDayLessonPayload(day, dayDirectory, state);

    try {
      setSaving(true);
      setApiError(null);

      if (isUpdate) {
        await window.rosewood.updateDayContent(
          projectPath,
          projectOptions,
          dayLessonContent,
        );
      } else {
        await window.rosewood.createDayContent(
          projectPath,
          projectOptions,
          dayLessonContent,
        );
      }

      await loadDaysContent(projectPath, projectOptions);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "API Error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
      header={
        <div className="flex items-center justify-between gap-4">
          <p className="text-2xl font-bold">
            {isUpdate ? `Day ${day}` : "New Day"}
          </p>

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
      <div className="flex h-full flex-col gap-4 overflow-y-auto">
        {apiError && <Feedback variant="error">{apiError}</Feedback>}

        <Collapsible title="Day Details">
          <div className="flex flex-col gap-3 pl-4">
            <div className="flex flex-row gap-2">
              <div className="w-40">
                <Input
                  type="number"
                  readOnly
                  className="w-38"
                  label="Day:"
                  value={day}
                />
              </div>

              <div className="w-1/4">
                <Input
                  type="text"
                  label="Label:"
                  value={state.label}
                  onChange={(event) => updateField("label", event.target.value)}
                />
              </div>

              <div className="w-1/4">
                <Input
                  type="text"
                  label="Description:"
                  value={state.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <TextArea
                id="lesson-targets"
                label="Lesson Targets"
                placeholder="Define the primary linguistic goals, vocabulary subsets, and pronunciation markers targeted for this day."
                value={state.lessonTargets}
                onChange={(event) =>
                  updateField("lessonTargets", event.target.value)
                }
              />

              <TextArea
                id="lore-targets"
                label="Lore and Rewards Targets"
                placeholder="Add narrative triggers, interactions, and unlocks awarded upon completion of the day."
                value={state.loreTargets}
                onChange={(event) =>
                  updateField("loreTargets", event.target.value)
                }
              />
            </div>
          </div>
        </Collapsible>

        <Collapsible title="Lesson Limits">
          <div className="pl-4">
            <div
              className={[
                "flex w-full flex-col bg-rosewood-surface px-4 py-2",
                "rounded-lg border-2 border-rosewood-ink",
                "text-rosewood-ink",
              ].join(" ")}
            >
              <p className="text-rosewood-accent">Pronunciation</p>

              <div className="flex flex-row gap-8">
                <Input
                  type="number"
                  className="w-38 bg-rosewood-white"
                  label="Minimum Record Time (ms)"
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
                  className="w-38 bg-rosewood-white"
                  label="Maximum Record Time (ms)"
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

              <hr className="my-4 border-dashed" />

              <p className="text-rosewood-accent">Writing</p>

              <div className="flex flex-row gap-8">
                <Input
                  type="number"
                  className="w-38 bg-rosewood-white"
                  label="Total Error"
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
                  className="w-38 bg-rosewood-white"
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

              <hr className="my-4 border-dashed" />

              <p className="text-rosewood-accent">Lesson Entry</p>

              <div className="flex flex-row gap-8">
                <Input
                  type="number"
                  className="w-38 bg-rosewood-white"
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

              <hr className="my-4 border-dashed" />
            </div>
          </div>
        </Collapsible>

        <Collapsible title="Lesson Entries">
          <div className="pl-4">
            <LessonEntries
              entries={state.entries}
              onChange={(entries) => updateField("entries", entries)}
            />
          </div>
        </Collapsible>

        <Collapsible title="Dialogues">
          <div className="pl-4">
            <DialogueList
              dialogues={state.dialogues}
              onChange={(dialogues) => updateField("dialogues", dialogues)}
            />
          </div>
        </Collapsible>
      </div>
    </Panel>
  );
}

import { useState } from "react";
import { useDaysContent } from "../../../contexts/DaysContentContext";
import { useFeedback } from "../../../contexts/FeedbackContext";
import { useProjectInfo } from "../../../contexts/ProjectInfoContext";
import { DayLessonContent } from "../../../../schemas/day";
import {
  LocaleContentOptions,
  LocaleStep,
  StepTypes,
} from "../../../../schemas/locales";
import { updateLessonStep } from "../actions/updateLessonStep";

export function useLessonStep() {
  const { showFeedback, clearFeedback } = useFeedback();
  const { loadDaysContent } = useDaysContent();
  const { projectPath } = useProjectInfo();
  const [saving, setSaving] = useState(false);

  const updateStep = async (
    options: LocaleContentOptions,
    entryId: string,
    stepType: StepTypes,
    stepContent: LocaleStep,
    dayContent: DayLessonContent,
  ) => {
    clearFeedback();
    try {
      setSaving(true);
      await updateLessonStep(
        projectPath,
        options,
        entryId,
        stepType,
        stepContent,
        dayContent,
      );
      await loadDaysContent(projectPath, {
        language: options.language,
        level: options.level,
      });
      showFeedback({ type: "success", message: "The step has been updated" });
    } catch (error) {
      showFeedback({ type: "error", message: "Error updating the step" });
    } finally {
      setSaving(false);
    }
  };

  return { saving, updateStep };
}

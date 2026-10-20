import { useState } from "react";
import { useDaysContent } from "../../../contexts/DaysContentContext";
import { useFeedback } from "../../../contexts/FeedbackContext";
import { useProjectInfo } from "../../../contexts/ProjectInfoContext";
import { LocaleContentOptions } from "../../../../schemas/locales";
import { DialogueKey, InteractionLine } from "../../../../schemas/dialogues";
import { createDialogueLine } from "../actions/createDialogueLine";
import { DayLessonContent } from "../../../../schemas/day";

export function useDialogues() {
  const { showFeedback, clearFeedback } = useFeedback();
  const { loadDaysContent } = useDaysContent();
  const { projectPath } = useProjectInfo();
  const [saving, setSaving] = useState(false);

  const addDialogueLine = async (
    options: LocaleContentOptions,
    dialogueKey: DialogueKey,
    line: InteractionLine,
    dayContent: DayLessonContent,
  ) => {
    clearFeedback();
    try {
      setSaving(true);
      await createDialogueLine(
        projectPath,
        options,
        dialogueKey,
        line,
        dayContent,
      );
      await loadDaysContent(projectPath, {
        language: options.language,
        level: options.level,
      });
      showFeedback({ type: "success", message: "The step has been updated" });
    } catch (error) {
      showFeedback({ type: "error", message: "Error creating dialogue line" });
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    addDialogueLine,
  };
}

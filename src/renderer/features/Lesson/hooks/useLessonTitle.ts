import { useState } from "react";
import { setLessonTitle } from "../actions/setLessonTitle";
import { useFeedback } from "../../../contexts/FeedbackContext";
import { useDaysContent } from "../../../contexts/DaysContentContext";
import { useProjectInfo } from "../../../contexts/ProjectInfoContext";
import { LocaleContentOptions } from "../../../../schemas/locales";
import { DayLessonContent } from "../../../../schemas/day";

export function useLessonTitle() {
  const [saving, setSaving] = useState(false);
  const { showFeedback, clearFeedback } = useFeedback();
  const { loadDaysContent } = useDaysContent();
  const { projectPath } = useProjectInfo();

  const saveTitle = async (
    options: LocaleContentOptions,
    title: string,
    dayContent: DayLessonContent,
  ) => {
    if (!projectPath || saving) return;

    clearFeedback();
    setSaving(true);

    try {
      await setLessonTitle(projectPath, options, title, dayContent);

      await loadDaysContent(projectPath, {
        language: options.language,
        level: options.level,
      });

      showFeedback({
        type: "success",
        message: "Title updated",
      });
    } catch (error) {
      showFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Unable to update the title",
      });
    } finally {
      setSaving(false);
    }
  };

  return { saveTitle, saving };
}

import { DayLessonContent } from "../../../../schemas/day";
import { LessonContentOptions } from "../../../../schemas/lesson";
import { useDaysContent } from "../../../contexts/DaysContentContext";
import { useFeedback } from "../../../contexts/FeedbackContext";
import { useProjectInfo } from "../../../contexts/ProjectInfoContext";
import { createLessonEntry } from "../actions/createLessonEntry";

export function useLessonEntry() {
  const { showFeedback, clearFeedback } = useFeedback();
  const { loadDaysContent } = useDaysContent();
  const { projectPath } = useProjectInfo();

  const createEntry = async (
    options: LessonContentOptions,
    target: string,
    dayContent: DayLessonContent,
  ) => {
    clearFeedback();
    try {
      await createLessonEntry(projectPath, options, target, dayContent);
      await loadDaysContent(projectPath, {
        language: options.language,
        level: options.level,
      });
      showFeedback({ type: "success", message: "New entry created" });
    } catch (error) {
      showFeedback({ type: "error", message: "Error creating the entry" });
    }
  };

  const editEntry = async () => {
    clearFeedback();
    try {
      showFeedback({ type: "success", message: "Entry updated" });
    } catch (error) {
      showFeedback({ type: "error", message: "Error updating the entry" });
    }
  };

  const removeEntry = async () => {
    clearFeedback();
    try {
      showFeedback({ type: "success", message: "Entry excluded" });
    } catch (error) {
      showFeedback({ type: "error", message: "Error removing entry" });
    }
  };

  return {
    createEntry,
    editEntry,
    removeEntry,
  };
}

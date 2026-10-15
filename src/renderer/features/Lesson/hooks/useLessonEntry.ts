import { DayLessonContent } from "../../../../schemas/day";
import { LessonContentOptions } from "../../../../schemas/lesson";
import { useDaysContent } from "../../../contexts/DaysContentContext";
import { useFeedback } from "../../../contexts/FeedbackContext";
import { useProjectInfo } from "../../../contexts/ProjectInfoContext";
import { createLessonEntry } from "../actions/createLessonEntry";
import { editLessonEntry } from "../actions/editLessonEntry";
import { removeLessonEntry } from "../actions/removeLessonEntry";

export function useLessonEntry() {
  const { showFeedback, clearFeedback } = useFeedback();
  const { loadDaysContent } = useDaysContent();
  const { projectPath } = useProjectInfo();

  const createEntry = async (
    options: LessonContentOptions,
    target: string | undefined,
    dayContent: DayLessonContent,
  ) => {
    if (!target) return;

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

  const editEntry = async (
    options: LessonContentOptions,
    entryId: string,
    target: string | undefined,
    dayContent: DayLessonContent,
  ) => {
    if (!target) return;

    clearFeedback();
    try {
      await editLessonEntry(projectPath, options, entryId, target, dayContent);
      await loadDaysContent(projectPath, {
        language: options.language,
        level: options.level,
      });
      showFeedback({ type: "success", message: "Entry updated" });
    } catch (error) {
      console.error(error);
      showFeedback({
        type: "error",
        message: `Error updating the entry: ${error}`,
      });
    }
  };

  const removeEntry = async (
    options: LessonContentOptions,
    entryId: string,
    dayContent: DayLessonContent,
  ) => {
    clearFeedback();
    try {
      const confirmed = window.confirm(
        `Remove entry ${entryId}? This will permanently delete all its content.`,
      );

      if (!confirmed) {
        return;
      }

      await removeLessonEntry(projectPath, options, entryId, dayContent);
      await loadDaysContent(projectPath, {
        language: options.language,
        level: options.level,
      });
      showFeedback({ type: "success", message: "Entry excluded" });
    } catch (error) {
      console.error(error);
      showFeedback({
        type: "error",
        message: `Error removing the entry: ${error}`,
      });
    }
  };

  return {
    createEntry,
    editEntry,
    removeEntry,
  };
}

import { DayLessonContent } from "../../../../schemas/day";
import { LessonContentOptions } from "../../../../schemas/lesson";

export async function removeLessonEntry(
  projectPath: string,
  options: LessonContentOptions,
  entryId: string,
  dayLessonContent: DayLessonContent,
): Promise<void> {
  const { lesson } = dayLessonContent;

  if (!lesson.entries?.[entryId]) {
    throw new Error(`Lesson entry "${entryId}" not found`);
  }

  const { [entryId]: _, ...entries } = lesson.entries;

  const updatedLesson = {
    ...lesson,
    entries,
  };

  await window.rosewood.updateLessonContent(
    projectPath,
    options,
    updatedLesson,
  );
}

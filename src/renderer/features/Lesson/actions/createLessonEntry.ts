import { DayLessonContent } from "../../../../schemas/day";
import {
  LessonBase,
  LessonContentOptions,
  LessonEntry,
} from "../../../../schemas/lesson";

export async function createLessonEntry(
  projectPath: string,
  options: LessonContentOptions,
  target: string,
  dayLessonContent: DayLessonContent,
): Promise<void> {
  const { lesson } = dayLessonContent;
  const entries = lesson.entries ?? {};

  const sequence =
    Math.max(0, ...Object.values(entries).map((entry) => entry.sequence)) + 1;

  const newEntry: LessonEntry = {
    id: String(sequence),
    target,
    sequence,
  };

  const updatedLesson: LessonBase = {
    ...lesson,
    entries: {
      ...entries,
      [newEntry.id]: newEntry,
    },
  };

  await window.rosewood.updateLessonContent(
    projectPath,
    options,
    updatedLesson,
  );
}

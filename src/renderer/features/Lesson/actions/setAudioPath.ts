import { DayLessonContent } from "../../../../schemas/day";
import {
  LessonBase,
  LessonContentOptions,
  LessonEntry,
} from "../../../../schemas/lesson";

export async function setAudioPath(
  projectPath: string,
  options: LessonContentOptions,
  entryId: string,
  audioPath: string,
  dayLessonContent: DayLessonContent,
): Promise<void> {
  const { lesson } = dayLessonContent;

  const entry = lesson.entries?.[entryId];

  if (!entry) {
    throw new Error(`Lesson entry "${entryId}" not found`);
  }

  const updatedEntry: LessonEntry = {
    ...entry,
    audio: audioPath,
  };

  const updatedLesson: LessonBase = {
    ...lesson,
    entries: {
      ...lesson.entries,
      [entryId]: updatedEntry,
    },
  };

  await window.rosewood.updateLessonContent(
    projectPath,
    options,
    updatedLesson,
  );
}

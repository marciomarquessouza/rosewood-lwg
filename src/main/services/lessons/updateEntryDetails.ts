import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import {
  lessonBaseSchema,
  type LessonBase,
} from "../../../schemas/lesson";
import {
  dayLessonLocalesScheme,
  localeContentOptionsSchema,
  type DayLessonLocales,
  type LocaleContentOptions,
} from "../../../schemas/locales";
import { validateLocaleExamples } from "../locales/validateLocaleExamples";
import { openProject } from "../project/openProject";

/**
 * Validate and stage both parts of an Entry before modifying either file.
 * If a write fails, restore originals. This provides rollback on ordinary
 * errors, not crash-safe atomicity across two files.
 */
export async function updateEntryDetails(
  projectPath: string,
  options: LocaleContentOptions,
  lesson: LessonBase,
  localized: DayLessonLocales,
): Promise<void> {
  const location = localeContentOptionsSchema.parse(options);
  const parsedLesson = lessonBaseSchema.parse(lesson);
  const parsedLocale = dayLessonLocalesScheme.parse(localized);
  validateLocaleExamples(parsedLocale);
  const { contentPath } = await openProject(projectPath);
  const directory = path.join(
    contentPath, location.language, location.level, "days", location.dayDirectory,
  );
  const files = [
    { destination: path.join(directory, "lesson.json"), content: JSON.stringify(parsedLesson, null, 2) },
    { destination: path.join(directory, "locales", `${location.locale}.json`), content: JSON.stringify(parsedLocale, null, 2) },
  ];
  const staged: Array<{ destination: string; temporary: string; previous: Buffer }> = [];
  const changed: typeof staged = [];
  try {
    for (const file of files) {
      const previous = await fs.readFile(file.destination);
      const temporary = `${file.destination}.${randomUUID()}.tmp`;
      staged.push({ destination: file.destination, temporary, previous });
      await fs.writeFile(temporary, file.content, { flag: "wx" });
    }
    for (const file of staged) {
      await fs.rename(file.temporary, file.destination);
      changed.push(file);
    }
  } catch (error) {
    const rollbackErrors: unknown[] = [];
    for (const file of [...changed].reverse()) {
      try {
        await fs.writeFile(file.destination, file.previous);
      } catch (rollbackError) {
        rollbackErrors.push(rollbackError);
      }
    }
    if (rollbackErrors.length) {
      throw new AggregateError([error, ...rollbackErrors], "Entry save failed and rollback was incomplete");
    }
    throw error;
  } finally {
    await Promise.all(staged.map(({ temporary }) => fs.rm(temporary, { force: true })));
  }
}

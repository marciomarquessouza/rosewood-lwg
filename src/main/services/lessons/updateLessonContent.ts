import fs from "node:fs/promises";
import path from "node:path";

import {
  LessonBase,
  lessonBaseSchema,
  LessonContentOptions,
} from "../../../schemas/lesson";
import { openProject } from "../project/openProject";

export async function updateLessonContent(
  targetPath: string,
  options: LessonContentOptions,
  lessonBase: LessonBase,
) {
  const { language, level, dayDirectory } = options;
  const { contentPath } = await openProject(targetPath);

  const lessonPath = path.join(
    contentPath,
    language,
    level,
    "days",
    dayDirectory,
    "lesson.json",
  );

  try {
    const lesson = lessonBaseSchema.parse(lessonBase);
    await fs.writeFile(lessonPath, JSON.stringify(lesson, null, 2));
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : `Unable to update the lesson - path: ${lessonBase}`;

    throw new Error(message);
  }
}

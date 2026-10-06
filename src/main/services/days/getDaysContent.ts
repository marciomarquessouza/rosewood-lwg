import fs from "node:fs/promises";
import path from "node:path";

import {
  dayDirectorySchema,
  DayLessonContent,
  dayLessonMetaSchema,
  DaysContent,
} from "../../../schemas/day";
import { dialogueBaseSchema } from "../../../schemas/dialogues";
import { lessonBaseSchema } from "../../../schemas/lesson";
import { ProjectOptions } from "../../../schemas/project";
import { openProject } from "../project/openProject";

export async function getDaysContent(
  targetPath: string,
  options: ProjectOptions,
): Promise<DaysContent> {
  const { contentPath } = await openProject(targetPath);
  const { language, level } = options;

  const projectPath = path.join(contentPath, language, level, "days");

  try {
    const entries = await fs.readdir(projectPath, {
      withFileTypes: true,
    });

    const validDayDirectories = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => dayDirectorySchema.safeParse(entry.name))
      .filter((result) => result.success)
      .map((result) => result.data);

    const days = await Promise.all(
      validDayDirectories.map(
        async (dayDirectory): Promise<DayLessonContent> => {
          const dayPath = path.join(projectPath, dayDirectory);

          const [metaRaw, lessonRaw, dialoguesRaw] = await Promise.all([
            fs.readFile(path.join(dayPath, "meta.json"), "utf-8"),
            fs.readFile(path.join(dayPath, "lesson.json"), "utf-8"),
            fs.readFile(path.join(dayPath, "dialogues.json"), "utf-8"),
          ]);

          const meta = dayLessonMetaSchema.parse(JSON.parse(metaRaw));
          const lesson = lessonBaseSchema.parse(JSON.parse(lessonRaw));
          const dialogues = dialogueBaseSchema.parse(JSON.parse(dialoguesRaw));

          return {
            ...meta,
            dayDirectory,
            lesson,
            dialogues,
            locales: {},
          };
        },
      ),
    );

    return {
      ...options,
      days,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : `Unable to find the Day content - path: ${projectPath}`;

    throw new Error(message);
  }
}

import fs from "node:fs/promises";
import path from "node:path";

import { ProjectOptions } from "../../../schemas/project";
import { openProject } from "../project/openProject";
import { DayLessonContent, dayLessonMetaSchema } from "../../../schemas/day";
import { lessonBaseSchema } from "../../../schemas/lesson";
import { dialogueBaseSchema } from "../../../schemas/dialogues";
import { Language } from "../../../schemas/language";

export async function createDayContent(
  targetPath: string,
  options: ProjectOptions,
  content: DayLessonContent,
): Promise<void> {
  const { contentPath } = await openProject(targetPath);
  const { language, level } = options;
  const { dayDirectory } = content;

  const projectPath = path.join(
    contentPath,
    language,
    level,
    "days",
    dayDirectory,
  );

  try {
    const dayMetaContent = dayLessonMetaSchema.parse(content);
    const lessonContent = lessonBaseSchema.parse(content.lesson);
    const dialoguesContent = dialogueBaseSchema.parse(content.dialogues);

    await fs.mkdir(projectPath, { recursive: true });

    await Promise.all([
      fs.writeFile(
        path.join(projectPath, "meta.json"),
        JSON.stringify(dayMetaContent, null, 2),
        "utf-8",
      ),
      fs.writeFile(
        path.join(projectPath, "lesson.json"),
        JSON.stringify(lessonContent, null, 2),
        "utf-8",
      ),
      fs.writeFile(
        path.join(projectPath, "dialogues.json"),
        JSON.stringify(dialoguesContent, null, 2),
        "utf-8",
      ),
    ]);

    const localesPath = path.join(projectPath, "locales");
    await fs.mkdir(localesPath, { recursive: true });

    for (const locale of Object.keys(content.locales)) {
      await fs.writeFile(
        path.join(localesPath, `${locale}.json`),
        JSON.stringify(content.locales[locale as Language], null, 2),
        "utf-8",
      );
    }
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : `Unable to create the Day content - path: ${projectPath}`;

    throw new Error(message);
  }
}

import fs from "node:fs/promises";
import path from "node:path";

import { ProjectOptions } from "../../../schemas/project";
import { DayLessonContent } from "../../../shared/day";
import { openProject } from "../project/openProject";

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
    await fs.mkdir(projectPath, { recursive: true });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error
        ? error.message
        : `Unable to create the Day content - path: ${projectPath}`;

    throw new Error(message);
  }
}

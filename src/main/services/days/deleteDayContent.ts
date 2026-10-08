import fs from "node:fs/promises";
import path from "node:path";

import { ProjectOptions } from "../../../schemas/project";
import { dayDirectorySchema } from "../../../schemas/day";
import { openProject } from "../project/openProject";

export async function deleteDayContent(
  targetPath: string,
  options: ProjectOptions,
  dayDirectory: string,
): Promise<void> {
  const { contentPath } = await openProject(targetPath);
  const { language, level } = options;

  const parsedDayDirectory = dayDirectorySchema.parse(dayDirectory);

  const dayPath = path.join(
    contentPath,
    language,
    level,
    "days",
    parsedDayDirectory,
  );

  try {
    await fs.access(dayPath);

    await fs.rm(dayPath, {
      recursive: true,
      force: false,
    });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : `Unable to delete the Day content - path: ${dayPath}`;

    throw new Error(message);
  }
}

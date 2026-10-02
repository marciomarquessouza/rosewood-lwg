import fs from "node:fs/promises";
import path from "node:path";

import { Language } from "../../../schemas/language";
import { Level } from "../../../schemas/level";
import { openProject } from "./openProject";

export async function deleteProjectContent(
  targetPath: string,
  language: Language,
  level: Level,
) {
  const { contentPath } = await openProject(targetPath);

  const languagePath = path.join(contentPath, language);
  const projectPath = path.join(languagePath, level);

  try {
    await fs.rm(projectPath, {
      recursive: true,
      force: true,
    });

    const remainingLevels = await fs.readdir(languagePath);

    if (remainingLevels.length === 0) {
      await fs.rm(languagePath, {
        recursive: true,
        force: true,
      });
    }
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : `Unable to delete the project - ${projectPath}`;

    throw new Error(message);
  }
}

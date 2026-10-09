import fs from "node:fs/promises";
import path from "node:path";

import { ProjectContentLines } from "../../../shared/project";
import { openProject } from "./openProject";
import { languageSchema } from "../../../schemas/language";
import { levelSchema } from "../../../schemas/level";
import { dayDirectorySchema } from "../../../schemas/day";
import {
  projectContentSchema,
  ProjectDay,
  projectDaySchema,
} from "../../../schemas/project";

export async function getProjectContent(
  projectPath: string,
): Promise<ProjectContentLines> {
  const { contentPath } = await openProject(projectPath);

  const languageEntries = await fs.readdir(contentPath, {
    withFileTypes: true,
  });

  const lines: ProjectContentLines["lines"] = [];

  for (const languageEntry of languageEntries) {
    if (!languageEntry.isDirectory()) continue;

    const languageResult = languageSchema.safeParse(languageEntry.name);

    if (!languageResult.success) continue;

    const language = languageResult.data;
    const languagePath = path.join(contentPath, languageEntry.name);

    const levelEntries = await fs.readdir(languagePath, {
      withFileTypes: true,
    });

    for (const levelEntry of levelEntries) {
      if (!levelEntry.isDirectory()) continue;

      const levelResult = levelSchema.safeParse(levelEntry.name);

      if (!levelResult.success) continue;

      const level = levelResult.data;
      const levelPath = path.join(languagePath, levelEntry.name);

      const metaPath = path.join(levelPath, "meta.json");

      const meta = JSON.parse(await fs.readFile(metaPath, "utf-8"));

      const daysPath = path.join(levelPath, "days");

      const dayEntries = await fs.readdir(daysPath, {
        withFileTypes: true,
      });

      const projectDays: ProjectDay[] = [];

      for (const dayEntry of dayEntries) {
        if (!dayEntry.isDirectory()) continue;
        const dayResult = dayDirectorySchema.safeParse(dayEntry.name);

        if (!dayResult.success) continue;

        const dayDirectory = dayResult.data;
        const dayDirectoryPath = path.join(daysPath, dayDirectory);

        const dayFilesResult = await fs.readdir(dayDirectoryPath, {
          withFileTypes: true,
        });

        const dayFiles = dayFilesResult
          .filter((entry) => entry.isFile())
          .map((entry) => entry.name);

        const projectDay = projectDaySchema.parse({
          directory: dayDirectory,
          files: dayFiles,
          path: dayDirectoryPath,
        });

        projectDays.push(projectDay);
      }

      const projectContent = projectContentSchema.parse({
        language,
        level,
        ...meta,
        days: projectDays,
        createdDays: projectDays.length,
      });

      lines.push(projectContent);
    }
  }

  lines.sort((a, b) =>
    `${a.language}|${a.level}`.localeCompare(`${b.language}|${b.level}`),
  );

  return { lines };
}

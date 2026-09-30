import fs from "node:fs/promises";
import path from "node:path";

import { languageSchema } from "../../schemas/language";
import { levelSchema } from "../../schemas/level";
import { projectContentSchema } from "../../schemas/project";
import type { ProjectContentLines, ProjectInfo } from "../../shared/project";
import { CONTENT_PATH } from "../constants";
import { dayDirectorySchema } from "../../schemas/day";

export async function openProject(projectPath: string): Promise<ProjectInfo> {
  const contentPath = path.join(projectPath, CONTENT_PATH);

  try {
    const stat = await fs.stat(contentPath);

    if (!stat.isDirectory()) {
      throw new Error();
    }
  } catch {
    throw new Error(`Invalid LWG project: ${CONTENT_PATH} was not found.`);
  }

  return {
    path: projectPath,
    contentPath,
  };
}

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

      const days = dayEntries
        .filter((entry) => entry.isDirectory())
        .map((entry) => dayDirectorySchema.safeParse(entry.name))
        .filter((result) => result.success)
        .map((result) => result.data)
        .sort();

      const projectContent = projectContentSchema.parse({
        language,
        level,
        ...meta,
        days,
        createdDays: days.length,
      });

      lines.push(projectContent);
    }
  }

  lines.sort((a, b) =>
    `${a.language}|${a.level}`.localeCompare(`${b.language}|${b.level}`),
  );

  return { lines };
}

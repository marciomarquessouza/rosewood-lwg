import fs from "node:fs/promises";
import path from "node:path";

import type { ProjectContent, ProjectInfo } from "../../shared/project";
import { CONTENT_PATH } from "../constants";
import { languageSchema } from "../../schemas/language";
import { levelSchema } from "../../schemas/level";
import { languageLevelSchema } from "../../schemas/languageLevel";

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
): Promise<ProjectContent> {
  const { contentPath } = await openProject(projectPath);
  const languageEntries = await fs.readdir(contentPath, {
    withFileTypes: true,
  });

  const lessonLanguages: ProjectContent["lessonLanguages"] = [];

  for (const languageEntry of languageEntries) {
    if (!languageEntry.isDirectory()) {
      continue;
    }

    const language = languageSchema.parse(languageEntry.name);

    const languagePath = path.join(contentPath, languageEntry.name);

    const levelEntries = await fs.readdir(languagePath, {
      withFileTypes: true,
    });

    const projects = [];

    for (const levelEntry of levelEntries) {
      if (!levelEntry.isDirectory()) {
        continue;
      }
      const level = levelSchema.parse(levelEntry.name);
      const levelMetaPath = path.join(
        contentPath,
        languageEntry.name,
        levelEntry.name,
        "meta.json",
      );
      const levelMeta = await fs.readFile(levelMetaPath, "utf-8");
      const meta = languageLevelSchema.parse(levelMeta);
      projects.push({
        language,
        level,
        meta,
      });
    }

    // const levels = levelEntries
    //   .filter((entry) => entry.isDirectory())
    //   .map((entry) => levelSchema.parse(entry.name))
    //   .sort();

    lessonLanguages.push({
      language,
      levels: [],
    });
  }

  return {
    lessonLanguages: lessonLanguages.sort((a, b) =>
      a.language.localeCompare(b.language),
    ),
  };
}

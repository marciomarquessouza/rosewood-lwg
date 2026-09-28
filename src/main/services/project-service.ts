import fs from "node:fs/promises";
import path from "node:path";

import type { ProjectContent, ProjectInfo } from "../../shared/project";
import { CONTENT_PATH } from "../constants";

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

    const languagePath = path.join(contentPath, languageEntry.name);

    const levelEntries = await fs.readdir(languagePath, {
      withFileTypes: true,
    });

    const levels = levelEntries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    lessonLanguages.push({
      language: languageEntry.name,
      levels,
    });
  }

  return {
    lessonLanguages: lessonLanguages.sort((a, b) =>
      a.language.localeCompare(b.language),
    ),
  };
}

import fs from "node:fs/promises";
import path from "node:path";

import { ProjectContent } from "../../../schemas/project";
import { openProject } from "./openProject";

export async function saveProjectContent(
  targetPath: string,
  projectContent: ProjectContent,
) {
  const { contentPath } = await openProject(targetPath);
  const { language, level } = projectContent;

  const projectPath = path.join(contentPath, language, level, "days");
  const metaPath = path.join(contentPath, language, level, "meta.json");

  try {
    await fs.mkdir(projectPath, { recursive: true });

    await fs.writeFile(
      metaPath,
      JSON.stringify(projectContent, null, 2),
      "utf8",
    );
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : `Unable to save the project meta file - ${metaPath}`;

    throw new Error(message);
  }
}

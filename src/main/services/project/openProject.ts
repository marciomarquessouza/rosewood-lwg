import fs from "node:fs/promises";
import path from "node:path";
import { CONTENT_PATH } from "../../constants";
import { ProjectInfo } from "../../../shared/project";

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

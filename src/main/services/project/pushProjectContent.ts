import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { openProject } from "./openProject";
import { PushResponseType } from "../../../shared/electron-api";

const execFileAsync = promisify(execFile);

export async function pushProjectContent(
  targetPath: string,
): Promise<PushResponseType> {
  const { contentPath } = await openProject(targetPath);

  const { stdout } = await execFileAsync(
    "git",
    ["status", "--porcelain", "--", "."],
    {
      cwd: contentPath,
    },
  );

  if (!stdout.trim()) {
    return "empty-tree";
  }

  await execFileAsync("git", ["add", "--", "."], {
    cwd: contentPath,
  });

  await execFileAsync(
    "git",
    ["commit", "-m", "Update project content", "--", "."],
    {
      cwd: contentPath,
    },
  );

  await execFileAsync("git", ["push"], {
    cwd: contentPath,
  });

  return "pushed";
}

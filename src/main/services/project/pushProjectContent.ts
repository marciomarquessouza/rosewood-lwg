import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { openProject } from "./openProject";

const execFileAsync = promisify(execFile);

export async function pushProjectContent(targetPath: string) {
  const { contentPath } = await openProject(targetPath);

  const { stdout } = await execFileAsync(
    "git",
    ["status", "--porcelain", "--", "."],
    {
      cwd: contentPath,
    },
  );

  if (!stdout.trim()) {
    throw new Error("There are no content changes to push.");
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

  return "updated";
}

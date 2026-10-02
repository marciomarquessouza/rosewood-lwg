import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { openProject } from "./openProject";

const execFileAsync = promisify(execFile);

export async function pullProjectContent(targetPath: string) {
  const { contentPath } = await openProject(targetPath);

  const { stdout } = await execFileAsync("git", ["status", "--porcelain"], {
    cwd: contentPath,
  });

  if (stdout.trim()) {
    throw new Error(
      "The LWG working tree has pending changes. Commit or discard them before pulling.",
    );
  }

  const response = await execFileAsync("git", ["pull"], {
    cwd: contentPath,
  });

  return response.stdout.trim();
}

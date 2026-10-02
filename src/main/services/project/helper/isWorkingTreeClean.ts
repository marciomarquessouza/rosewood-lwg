import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function isWorkingTreeClean(projectPath: string) {
  const { stdout } = await execFileAsync("git", ["status", "--porcelain"], {
    cwd: projectPath,
  });

  return stdout.trim() === "";
}

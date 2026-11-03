import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function generateImporters(targetPath: string): Promise<void> {
  const scriptPath = path.join(
    targetPath,
    "scripts",
    "lesson",
    "generate-content-importers.mjs",
  );

  await execFileAsync(process.execPath, [scriptPath], {
    cwd: targetPath,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
    },
  });
}

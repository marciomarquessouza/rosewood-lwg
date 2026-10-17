import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { LessonContentOptions } from "../../../schemas/lesson";

const execFileAsync = promisify(execFile);

export async function generateAudio(
  targetPath: string,
  options: LessonContentOptions,
  target: string,
): Promise<{ path: string }> {
  const { language, level, dayDirectory } = options;

  const { stdout } = await execFileAsync(
    "node",
    [
      "dist/audio-generator-v2.cjs",
      "--language",
      language,
      "--level",
      level,
      "--day",
      dayDirectory,
      "--entry",
      `"${target}"`,
    ],
    {
      cwd: targetPath,
    },
  );
  const match = stdout.trim().match(/"path"\s*:\s*"([^"]+\.mp3)"/);
  const path = match?.[1] ?? null;

  if (!path) {
    throw new Error(
      `Error generating the audio path. Response ${stdout.trim()}`,
    );
  }

  return { path };
}

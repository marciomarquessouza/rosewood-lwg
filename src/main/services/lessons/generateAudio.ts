import { execFile } from "node:child_process";
import { promisify } from "node:util";

import { LessonContentOptions } from "../../../schemas/lesson";

const execFileAsync = promisify(execFile);

export interface ExampleAudioIdentity {
  entryId: string;
  exampleId: string;
  locale: string;
}

export async function generateAudio(
  targetPath: string,
  options: LessonContentOptions,
  target: string,
  example?: ExampleAudioIdentity,
): Promise<{ path: string }> {
  const { language, level, dayDirectory } = options;

  const args = [
    "dist/audio-generator-v2.cjs",
    "--language",
    language,
    "--level",
    level,
    "--day",
    dayDirectory,
    "--entry",
    target,
  ];

  if (example) {
    args.push(
      "--entry-id",
      example.entryId,
      "--example-id",
      example.exampleId,
      "--locale",
      example.locale,
    );
  }

  const { stdout } = await execFileAsync("node", args, {
    cwd: targetPath,
  });

  const jsonLine = stdout
    .trim()
    .split(/\r?\n/)
    .reverse()
    .find((line) => {
      try {
        const value = JSON.parse(line);
        return (
          typeof value === "object" &&
          value !== null &&
          typeof value.success === "boolean"
        );
      } catch {
        return false;
      }
    });

  if (!jsonLine) {
    throw new Error(`Audio generator returned no valid response: ${stdout}`);
  }

  const response = JSON.parse(jsonLine) as {
    success: boolean;
    path?: string;
    error?: string;
  };

  if (!response.success || !response.path) {
    throw new Error(response.error ?? "Audio generation failed");
  }

  return { path: response.path };
}

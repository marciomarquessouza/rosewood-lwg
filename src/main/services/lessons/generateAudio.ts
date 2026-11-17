import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
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

  // execFile passes arguments directly, so extra shell quotes are not needed.
  const { stdout } = await execFileAsync(
    "node",
    [
      "dist/audio-generator-v2.cjs",
      "--language", language,
      "--level", level,
      "--day", dayDirectory,
      "--entry", target,
    ],
    { cwd: targetPath },
  );

  const match = stdout.trim().match(/"path"\s*:\s*"([^"]+\.mp3)"/);
  const generatedPath = match?.[1];
  if (!generatedPath) {
    throw new Error(`Error generating the audio path. Response ${stdout.trim()}`);
  }

  if (!example) return { path: generatedPath };

  if (!example.entryId || !example.exampleId || !example.locale) {
    throw new Error("Missing example audio identity");
  }

  // The legacy generator chooses filenames from the spoken text. Copy to a
  // stable identity-based path to prevent examples with equal text from
  // sharing one mutable output file.
  const publicDir = path.resolve(targetPath, "public");
  const source = path.resolve(publicDir, generatedPath);
  if (!source.startsWith(publicDir + path.sep) || path.extname(source).toLowerCase() !== ".mp3") {
    throw new Error("Audio generator returned an invalid path");
  }

  const hash = createHash("sha256")
    .update(JSON.stringify([language, level, dayDirectory, example.locale, example.entryId, example.exampleId]))
    .digest("hex").slice(0, 20);
  const relativePath = path.posix.join(
    "audio", language, level, dayDirectory, "examples", `${hash}.mp3`,
  );
  const destination = path.resolve(publicDir, relativePath);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  if (source !== destination) {
    await fs.copyFile(source, destination);
  }
  return { path: relativePath };
}

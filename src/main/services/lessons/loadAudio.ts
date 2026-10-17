import { readFile } from "node:fs/promises";
import path from "node:path";

export async function loadAudio(
  projectPath: string,
  audioPath: string,
): Promise<Buffer<ArrayBuffer>> {
  const publicDir = path.resolve(projectPath, "public");
  const filePath = path.resolve(publicDir, audioPath);

  if (
    !filePath.startsWith(publicDir + path.sep) ||
    path.extname(filePath).toLowerCase() !== ".mp3"
  ) {
    throw new Error("Invalid audio path");
  }

  return readFile(filePath);
}

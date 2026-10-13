import fs from "node:fs/promises";
import path from "node:path";

import {
  DayLessonLocales,
  LocaleContentOptions,
} from "../../../schemas/locales";
import { openProject } from "../project/openProject";

export async function updateLocaleContent(
  targetPath: string,
  options: LocaleContentOptions,
  content: DayLessonLocales,
) {
  const { language, level, dayDirectory, locale } = options;
  const { contentPath } = await openProject(targetPath);

  const localePath = path.join(
    contentPath,
    language,
    level,
    "days",
    dayDirectory,
    "locales",
    `${locale}.json`,
  );

  try {
    await fs.writeFile(localePath, JSON.stringify(content, null, 2));
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error
        ? error.message
        : `Unable to update the location - path: ${localePath}`;

    throw new Error(message);
  }
}

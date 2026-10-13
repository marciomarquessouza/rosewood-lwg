import { DayLessonContent } from "../../../../schemas/day";
import { LocaleContentOptions } from "../../../../schemas/locales";
import { createDefaultLocaleContent } from "../helpers/createDefaultLocaleContent";

export async function setLessonTitle(
  projectPath: string,
  options: LocaleContentOptions,
  title: string,
  dayLessonContent: DayLessonContent,
) {
  const locale = options.locale;
  const currentContent =
    dayLessonContent.locales[locale] ?? createDefaultLocaleContent();

  const updatedContent = {
    ...currentContent,
    lesson: {
      ...currentContent.lesson,
      title,
    },
  };

  await window.rosewood.updateLocaleContent(
    projectPath,
    options,
    updatedContent,
  );
}

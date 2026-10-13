import { DayLessonContent } from "../../../../schemas/day";
import { Language } from "../../../../schemas/language";

export function getTitleFromDayContent(
  locale: Language,
  dayLessonContent: DayLessonContent,
): string {
  const localeContent = dayLessonContent.locales[locale];
  return localeContent?.lesson.title ?? "";
}

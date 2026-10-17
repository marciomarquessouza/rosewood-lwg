import { DayLessonContent } from "../../../../schemas/day";
import { Language } from "../../../../schemas/language";
import { StepTypes } from "../../../../schemas/locales";
import { LocaleStepData } from "../forms/LessonStepForm";

export function getStepContent(
  locale: Language,
  entryId: string,
  stepType: StepTypes,
  dayContent: DayLessonContent,
): LocaleStepData | undefined {
  const { locales } = dayContent;
  const localeContent = locales[locale];

  if (!localeContent) return;

  const entryContent = localeContent.lesson.entries[entryId];

  if (!entryContent) return;

  return entryContent.steps[stepType];
}

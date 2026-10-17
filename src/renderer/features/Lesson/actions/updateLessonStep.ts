import { DayLessonContent } from "../../../../schemas/day";
import {
  DayLessonLocales,
  LocaleContentOptions,
  LocaleEntryScheme,
  LocaleStep,
  StepTypes,
} from "../../../../schemas/locales";

export async function updateLessonStep(
  projectPath: string,
  options: LocaleContentOptions,
  entryId: string,
  stepType: StepTypes,
  stepContent: LocaleStep,
  dayLessonContent: DayLessonContent,
): Promise<void> {
  const { locales } = dayLessonContent;
  const localeContent = locales[options.locale];

  if (!localeContent) {
    throw new Error(`Locale "${options.locale}" not found`);
  }

  const localeEntry = localeContent.lesson.entries[entryId] ?? {};
  const currentSteps = localeEntry.steps ?? {};
  const updatedEntry: LocaleEntryScheme = {
    ...localeEntry,
    steps: {
      ...currentSteps,
      [stepType]: stepContent,
    },
  };

  const updatedLocaleContent: DayLessonLocales = {
    ...localeContent,
    lesson: {
      ...localeContent.lesson,
      entries: {
        ...localeContent.lesson.entries,
        [entryId]: updatedEntry,
      },
    },
  };

  await window.rosewood.updateLocaleContent(
    projectPath,
    options,
    updatedLocaleContent,
  );
}

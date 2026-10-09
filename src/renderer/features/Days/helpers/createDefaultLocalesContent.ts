import { DEFAULT_DIALOGUES } from "../../../../constants/dialogues";
import { DialogueKey } from "../../../../schemas/dialogues";
import { Language } from "../../../../schemas/language";
import { DayLessonLocales } from "../../../../schemas/locales";

export function createDefaultLocalesContent(
  locales: Language[],
): Partial<Record<Language, DayLessonLocales>> {
  const dialogues = (Object.keys(DEFAULT_DIALOGUES) as DialogueKey[]).reduce<
    DayLessonLocales["dialogues"]
  >(
    (acc, key) => {
      acc[key] = { lines: [] };
      return acc;
    },
    {} as DayLessonLocales["dialogues"],
  );

  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      {
        lesson: {
          title: "",
          entries: {},
        },
        dialogues: structuredClone(dialogues),
      },
    ]),
  );
}

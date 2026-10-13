import { DEFAULT_DIALOGUES } from "../../../../constants/dialogues";
import { DialogueKey } from "../../../../schemas/dialogues";
import { DayLessonLocales } from "../../../../schemas/locales";

export function createDefaultLocaleContent() {
  const dialogues = (Object.keys(DEFAULT_DIALOGUES) as DialogueKey[]).reduce<
    DayLessonLocales["dialogues"]
  >(
    (acc, key) => {
      acc[key] = { lines: [] };
      return acc;
    },
    {} as DayLessonLocales["dialogues"],
  );

  return {
    lesson: {
      title: "",
      entries: {},
    },
    dialogues: structuredClone(dialogues),
  };
}

import { DayLessonContent } from "../../../../schemas/day";
import { DialogueKey, InteractionLine } from "../../../../schemas/dialogues";
import {
  DayLessonLocales,
  LocaleContentOptions,
} from "../../../../schemas/locales";

export async function createDialogueLine(
  projectPath: string,
  options: LocaleContentOptions,
  dialogueKey: DialogueKey,
  line: InteractionLine,
  dayLessonContent: DayLessonContent,
) {
  const { locales } = dayLessonContent;
  const localeContent = locales[options.locale];

  if (!localeContent) {
    throw new Error(`Locale "${options.locale}" not found`);
  }

  const dialogueContent = localeContent.dialogues[dialogueKey];

  if (!dialogueContent) {
    throw new Error(`Dialogue "${dialogueKey}" not found`);
  }

  const lines = dialogueContent.lines ?? [];

  const updatedLocaleContent: DayLessonLocales = {
    ...localeContent,
    dialogues: {
      ...localeContent.dialogues,
      [dialogueKey]: {
        lines: [...lines, line],
      },
    },
  };

  await window.rosewood.updateLocaleContent(
    projectPath,
    options,
    updatedLocaleContent,
  );
}

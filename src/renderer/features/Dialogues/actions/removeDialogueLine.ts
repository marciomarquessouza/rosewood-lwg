import { DayLessonContent } from "../../../../schemas/day";
import { DialogueKey } from "../../../../schemas/dialogues";
import {
  DayLessonLocales,
  LocaleContentOptions,
} from "../../../../schemas/locales";

export async function removeDialogueLine(
  projectPath: string,
  options: LocaleContentOptions,
  dialogueKey: DialogueKey,
  lineIndex: number,
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

  const lines = dialogueContent.lines.filter((_, index) => lineIndex !== index);

  const updatedLocaleContent: DayLessonLocales = {
    ...localeContent,
    dialogues: {
      ...localeContent.dialogues,
      [dialogueKey]: { lines },
    },
  };

  await window.rosewood.updateLocaleContent(
    projectPath,
    options,
    updatedLocaleContent,
  );
}

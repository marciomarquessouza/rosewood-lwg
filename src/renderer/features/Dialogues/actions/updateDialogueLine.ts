import { DayLessonContent } from "../../../../schemas/day";
import { DialogueKey, InteractionLine } from "../../../../schemas/dialogues";
import {
  DayLessonLocales,
  LocaleContentOptions,
} from "../../../../schemas/locales";

export async function updateDialogueLine(
  projectPath: string,
  options: LocaleContentOptions,
  dialogueKey: DialogueKey,
  lineIndex: number,
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

  const lines = dialogueContent.lines.map((currentLine, index) =>
    lineIndex === index ? line : currentLine,
  );

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

import { DayLessonContent } from "../../../../schemas/day";
import { DialogueKey, InteractionLine } from "../../../../schemas/dialogues";
import { LocaleContentOptions } from "../../../../schemas/locales";

export function getDialogueLine(
  options: LocaleContentOptions,
  dialogueKey: DialogueKey,
  dayContent: DayLessonContent,
  lineIndex: number,
): InteractionLine | undefined {
  const { locale } = options;
  return dayContent.locales[locale]?.dialogues?.[dialogueKey].lines?.[
    lineIndex
  ];
}

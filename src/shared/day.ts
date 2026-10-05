import { DayDirectory } from "../schemas/day";
import { DialogueKey, InteractionLine } from "../schemas/dialogues";
import { Language } from "../schemas/language";
import { Lesson, LessonEntry } from "../schemas/lesson";
import { Level } from "../schemas/level";

export interface DayLessonLocale {
  lesson: {
    title: string;
    entries: Record<string, LessonEntry>;
  };
  dialogues: Record<
    DialogueKey,
    {
      lines: InteractionLine[];
    }
  >;
}

export interface DayLessonContent {
  day: number;
  dayDirectory: DayDirectory;
  lesson: Omit<Lesson, "entries">;
  locales: Partial<Record<Language, DayLessonLocale>>;
}

export interface DaysContent {
  language: Language;
  level: Level;
  days: DayLessonContent[];
}

import { DayDirectory } from "../schemas/day";
import {
  DialogueKey,
  DialoguesBase,
  InteractionLine,
} from "../schemas/dialogues";
import { Language } from "../schemas/language";
import { LessonBase, LessonEntry } from "../schemas/lesson";
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
  code: string;
  lessonTargets: string;
  loreTargets: string;
  lesson: LessonBase;
  dialogues: DialoguesBase;
  locales: Partial<Record<Language, DayLessonLocale>>;
}

export interface DayLessonBaseContent {
  day: number;
  dayDirectory: DayDirectory;
  lesson: LessonBase;
  locales: Partial<Record<Language, DayLessonLocale>>;
}

export interface DaysContent {
  language: Language;
  level: Level;
  days: DayLessonContent[];
}

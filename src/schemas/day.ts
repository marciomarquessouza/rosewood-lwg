import { z } from "zod";
import { LessonBaseSchema } from "./lesson";
import { DialogueBaseSchema } from "./dialogues";
import { languageSchema } from "./language";
import { dayLessonLocalesScheme } from "./locales";
import { levelSchema } from "./level";

export const dayDirectorySchema = z.string().regex(/^day_\d{2}$/);

export type DayDirectory = z.infer<typeof dayDirectorySchema>;

export const dayLessonContentSchema = z.object({
  day: z.number().int().nonnegative(),
  dayDirectory: dayDirectorySchema,
  code: z.string().min(1),
  lessonTargets: z.string().min(1),
  loreTargets: z.string().min(1),
  lesson: LessonBaseSchema,
  dialogues: DialogueBaseSchema,
  locales: z.partialRecord(languageSchema, dayLessonLocalesScheme),
});

export type DayLessonContent = z.infer<typeof dayLessonContentSchema>;

export const dayLessonMetaSchema = z.object({
  day: z.number().int().nonnegative(),
  dayDirectory: dayDirectorySchema,
  code: z.string().min(1),
  lessonTargets: z.string().min(1),
  loreTargets: z.string().min(1),
});

export type DayLessonMeta = z.infer<typeof dayLessonMetaSchema>;

export const DaysContentSchema = z.object({
  language: languageSchema,
  level: levelSchema,
  days: z.array(dayLessonContentSchema),
});

export type DaysContent = z.infer<typeof DaysContentSchema>;

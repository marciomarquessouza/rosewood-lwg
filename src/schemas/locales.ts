import { z } from "zod";
import { dialogueKeySchema, InteractionLineSchema } from "./dialogues";
import { languageSchema } from "./language";
import { levelSchema } from "./level";

export const stepTypesSchema = z.enum([
  "introduction",
  "listening",
  "pronunciation",
  "writing",
]);

export type StepTypes = z.infer<typeof stepTypesSchema>;

export const localeStepSchema = z.object({
  text: z.string(),
  instruction: z.string(),
  meanings: z.array(z.string()).optional(),
  gender: z.string().optional(),
});

export type LocaleStep = z.infer<typeof localeStepSchema>;

export const localeEntryScheme = z.object({
  reference: z.string().optional(),
  steps: z.partialRecord(stepTypesSchema, localeStepSchema),
});

export type LocaleEntryScheme = z.infer<typeof localeEntryScheme>;

export const dayLessonLocalesScheme = z.object({
  lesson: z.object({
    title: z.string(),
    entries: z.record(z.string(), localeEntryScheme),
  }),
  dialogues: z.record(
    dialogueKeySchema,
    z.object({ lines: z.array(InteractionLineSchema) }),
  ),
});

export type DayLessonLocales = z.infer<typeof dayLessonLocalesScheme>;

export const localeContentOptionsSchema = z.object({
  language: languageSchema,
  level: levelSchema,
  dayDirectory: z.string().regex(/^day_\d{2}$/),
  locale: languageSchema,
});

export type LocaleContentOptions = z.infer<typeof localeContentOptionsSchema>;

import { z } from "zod";
import { dialogueKeySchema, InteractionLineSchema } from "./dialogues";

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
});

export type LocaleStep = z.infer<typeof localeStepSchema>;

export const localeEntryScheme = z.object({
  reference: z.string(),
  steps: z.object(z.partialRecord(stepTypesSchema, localeStepSchema)),
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

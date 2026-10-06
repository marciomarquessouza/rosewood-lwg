import { z } from "zod";
import { LessonEntryBaseSchema } from "./lesson";
import { dialogueKeySchema, InteractionLineSchema } from "./dialogues";

export const dayLessonLocalesScheme = z.object({
  lesson: z.object({
    title: z.string(),
    entries: z.record(z.string(), LessonEntryBaseSchema),
  }),
  dialogues: z.record(
    dialogueKeySchema,
    z.object({ lines: z.array(InteractionLineSchema) }),
  ),
});

export type DayLessonLocales = z.infer<typeof dayLessonLocalesScheme>;

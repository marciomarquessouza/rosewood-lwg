import { z } from "zod";

export const languageLevelSchema = z.object({
  description: z.string(),
  lore: z.string(),
  plannedLessons: z.number().int().min(0).default(0),
  plannedDays: z.number().int().min(0).default(0),
});

export type LanguageLevel = z.infer<typeof languageLevelSchema>;

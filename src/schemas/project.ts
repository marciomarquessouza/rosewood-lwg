import { z } from "zod";
import { levelSchema } from "./level";
import { languageSchema } from "./language";

export const projectContentSchema = z.object({
  language: languageSchema,
  level: levelSchema,
  description: z.string(),
  lore: z.string(),
  plannedLessons: z.number().int().min(0).default(0),
  plannedDays: z.number().int().min(0).default(0),
});

export type ProjectContent = z.infer<typeof projectContentSchema>;

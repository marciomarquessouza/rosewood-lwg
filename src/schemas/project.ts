import { z } from "zod";
import { levelSchema } from "./level";
import { languageSchema } from "./language";

export const projectContentSchema = z.object({
  language: languageSchema,
  level: levelSchema,
  description: z.string(),
  lore: z.string(),
  lessonPlan: z.string().default(""),
  plannedDays: z.number().int().min(0).default(0),
  createdDays: z.number().int().min(0).default(0),
  days: z.array(z.string()),
  locales: z.array(languageSchema).default([]),
});

export type ProjectContent = z.infer<typeof projectContentSchema>;

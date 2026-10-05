import { z } from "zod";
import { levelSchema } from "./level";
import { languageSchema } from "./language";

const projectOptionsSchema = z.object({
  language: languageSchema,
  level: levelSchema,
});

export type ProjectOptions = z.infer<typeof projectOptionsSchema>;

export const projectContentSchema = z.object({
  language: languageSchema,
  level: levelSchema,
  lessonPlan: z.string().min(1, "Lesson Plan is required"),
  lore: z.string().trim().min(1, "Lore is required"),
  plannedDays: z.number().int().min(1, "Planned days is required").default(1),
  createdDays: z.number().int().min(0).default(0),
  days: z.array(z.string()).default([]),
  locales: z.array(languageSchema).min(1, "At last one locale is required"),
});

export type ProjectContent = z.infer<typeof projectContentSchema>;

import { z } from "zod";

export const characterTimelineTypeSchema = z.enum([
  "birth",
  "education",
  "career",
  "relationship",
  "loss",
  "milestone",
  "other",
]);

export const characterTimelineEntrySchema = z.object({
  id: z.string().min(1),
  date: z.string().trim().min(1, "Date is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string(),
  type: characterTimelineTypeSchema,
});

export type CharacterTimelineType = z.infer<typeof characterTimelineTypeSchema>;
export type CharacterTimelineEntry = z.infer<typeof characterTimelineEntrySchema>;

export const characterProfileSchema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase, hyphenated ID"),
  name: z.string().trim().min(1, "Name is required"),
  displayName: z.string(),
  description: z.string(),
  appearance: z.string(),
  personality: z.string(),
  background: z.string(),
  lore: z.string(),
  notes: z.string(),
  avatarPath: z.string().optional(),
  timeline: z.array(characterTimelineEntrySchema).default([]),
});

export type CharacterProfile = z.infer<typeof characterProfileSchema>;

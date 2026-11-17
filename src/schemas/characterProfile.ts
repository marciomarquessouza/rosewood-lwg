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
  age: z.string().optional(),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string(),
  type: characterTimelineTypeSchema,
});

export type CharacterTimelineType = z.infer<typeof characterTimelineTypeSchema>;
export type CharacterTimelineEntry = z.infer<typeof characterTimelineEntrySchema>;

export const characterRelationshipTypeSchema = z.enum([
  "mother",
  "father",
  "parent",
  "son",
  "daughter",
  "child",
  "brother",
  "sister",
  "sibling",
  "partner",
  "spouse",
  "grandparent",
  "grandchild",
  "aunt",
  "uncle",
  "cousin",
  "guardian",
  "other",
]);

export const characterRelationshipSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Name is required"),
  type: characterRelationshipTypeSchema,
  description: z.string().default(""),
  position: z.object({ x: z.number(), y: z.number() }).optional(),
});

export type CharacterRelationship = z.infer<typeof characterRelationshipSchema>;
export type CharacterRelationshipType = z.infer<typeof characterRelationshipTypeSchema>;

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
  relationships: z.array(characterRelationshipSchema).default([]),
});

export type CharacterProfile = z.infer<typeof characterProfileSchema>;

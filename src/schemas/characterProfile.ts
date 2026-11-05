import { z } from "zod";

export const characterProfileSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase, hyphenated ID"),
  name: z.string().trim().min(1, "Name is required"),
  displayName: z.string(),
  description: z.string(),
  appearance: z.string(),
  personality: z.string(),
  background: z.string(),
  lore: z.string(),
  notes: z.string(),
});

export type CharacterProfile = z.infer<typeof characterProfileSchema>;

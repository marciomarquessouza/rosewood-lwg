import { z } from "zod";
import { DEFAULT_DIALOGUES } from "../constants/dialogues";
import { ACTORS, MOODS } from "../constants/actors";
import { gameSceneSchema } from "./scene";

export const MoodSchema = z.enum([
  MOODS.NEUTRAL,
  MOODS.TALKING,
  MOODS.SAD,
  MOODS.ANGRY,
  MOODS.HAPPY,
  MOODS.SURPRISED,
  MOODS.FLUSHED,
]);

export const CharacterSchema = z.enum([
  ACTORS.JAILER,
  ACTORS.TUTOR,
  ACTORS.PLAYER,
  ACTORS.PUNISHER,
  ACTORS.LEARNING_NODE,
  ACTORS.GUARDIAN,
]);

export const CharacterMoodSchema = z.object({
  character: CharacterSchema,
  mood: MoodSchema,
});

export const dialogueKeySchema = z.enum(
  Object.keys(DEFAULT_DIALOGUES) as [
    keyof typeof DEFAULT_DIALOGUES,
    ...(keyof typeof DEFAULT_DIALOGUES)[],
  ],
);

export type DialogueKey = z.infer<typeof dialogueKeySchema>;

/**
 * Interaction Type
 */

export const InteractionTypeSchema = z.enum([
  "dialogue",
  "alternatives",
  "input",
  "lesson",
]);

export type InteractionTypes = z.infer<typeof InteractionTypeSchema>;

/**
 * Character
 */

export type Character = z.infer<typeof CharacterSchema>;

/**
 * Alternative
 */

export const AlternativeSchema = z.object({
  id: z.string().min(1),
  text: z.string(),
});

export type Alternative = z.infer<typeof AlternativeSchema>;

/**
 * Base Line
 */

export const BaseLineSchema = z.object({
  text: z.string(),
  character: CharacterSchema,
  moods: z.array(CharacterMoodSchema).optional(),
  speed: z.number().positive().optional(),
});

export type BaseLine = z.infer<typeof BaseLineSchema>;

/**
 * Dialogue Line
 */

export const DialogueLineSchema = BaseLineSchema.extend({
  type: z.literal("dialogue"),
});

export type DialogueLine = z.infer<typeof DialogueLineSchema>;

/**
 * Alternatives Line
 */

export const AlternativeLineSchema = BaseLineSchema.extend({
  type: z.literal("alternatives"),
  alternatives: z.array(AlternativeSchema),
});

export type AlternativeLine = z.infer<typeof AlternativeLineSchema>;

/**
 * Input Line
 */

export const InputLineSchema = BaseLineSchema.extend({
  type: z.literal("input"),
  inputLabel: z.string(),
});

export type InputLine = z.infer<typeof InputLineSchema>;

/**
 * Interaction Line
 */

export const InteractionLineSchema = z.discriminatedUnion("type", [
  DialogueLineSchema,
  AlternativeLineSchema,
  InputLineSchema,
]);

export type InteractionLine = z.infer<typeof InteractionLineSchema>;

/**
 * Dialogue Entry
 */

export const DialogueEntrySchema = z.object({
  scene: z.string().optional(),
  lines: z.array(InteractionLineSchema),
});

export const DialogueEntryBaseSchema = z.object({
  label: z.string(),
  scene: gameSceneSchema,
  skip: z.boolean(),
});

export type DialogueEntryBase = z.infer<typeof DialogueEntryBaseSchema>;

export type DialogueEntry = z.infer<typeof DialogueEntrySchema>;

/**
 * Dialogues
 */

// export const DialoguesBaseSchema = z.record()
export const DialoguesSchema = z.record(dialogueKeySchema, DialogueEntrySchema);

export const DialogueBaseSchema = z.record(
  dialogueKeySchema,
  DialogueEntryBaseSchema,
);

export type DialoguesBase = z.infer<typeof DialogueBaseSchema>;

export type Dialogues = Record<DialogueKey, DialogueEntry>;

export type DefaultDialogues = Dialogues;

export type DayDialogues = Partial<Dialogues>;

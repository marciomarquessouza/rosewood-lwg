import { z } from "zod";

export enum ACTORS {
  JAILER = "jailer",
  TUTOR = "tutor",
  PLAYER = "player",
  PUNISHER = "punisher",
  LEARNING_NODE = "learningNode",
  GUARDIAN = "guardian",
}

export const CharacterSchema = z.enum([
  ACTORS.JAILER,
  ACTORS.TUTOR,
  ACTORS.PLAYER,
  ACTORS.PUNISHER,
  ACTORS.LEARNING_NODE,
  ACTORS.GUARDIAN,
]);

export enum MOODS {
  NEUTRAL = "neutral",
  TALKING = "talking",
  SAD = "sad",
  ANGRY = "angry",
  HAPPY = "happy",
  SURPRISED = "surprised",
  FLUSHED = "flushed",
}

export const MoodSchema = z.enum([
  MOODS.NEUTRAL,
  MOODS.TALKING,
  MOODS.SAD,
  MOODS.ANGRY,
  MOODS.HAPPY,
  MOODS.SURPRISED,
  MOODS.FLUSHED,
]);

export const CharacterMoodSchema = z.object({
  character: CharacterSchema,
  mood: MoodSchema,
});

export const DIALOGUES = {
  CELL: {
    WELCOME: "cell.welcome",
    MARLENE_FIRST_INTERACTION: "cell.marlene_first_interaction",
    DAILY_CHALLENGE: "cell.daily_challenge",
    DESK_INTERACTION: "cell.desk_interaction",
    DESK_BLOCKED: "cell.desk_blocked",
    FOOD_INTERACTION: "cell.food_interaction",
    FOOD_BLOCKED: "cell.food_blocked",
    RAT_INTERACTION: "cell.rat_interaction",
    RAT_BLOCKED: "cell.rat_blocked",
    BED_INTERACTION: "cell.bed_interaction",
    BED_BLOCKED: "cell.bed_blocked",
  },

  DREAM: {
    // game
    INTRODUCTION: "dream.introduction",
    // Lesson
    LESSON_PREPARATION: "dream.lesson_preparation",
    LESSON_BEGIN: "dream.lesson_begin",
    LESSON_FINISH: "dream.lesson_finish",
    // Review
    REVIEW_INTRO: "dream.review_intro",
  },

  TRAIN: {
    INTRODUCTION: "train.introduction",
  },
} as const;

type ValueOf<T> = T[keyof T];

export type DialogueKey =
  | ValueOf<typeof DIALOGUES.CELL>
  | ValueOf<typeof DIALOGUES.DREAM>
  | ValueOf<typeof DIALOGUES.TRAIN>;

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

export type DialogueEntry = z.infer<typeof DialogueEntrySchema>;

/**
 * Dialogues
 */

export const DialoguesSchema = z.record(z.string(), DialogueEntrySchema);

export type Dialogues = Record<DialogueKey, DialogueEntry>;

export type DefaultDialogues = Dialogues;

export type DayDialogues = Partial<Dialogues>;

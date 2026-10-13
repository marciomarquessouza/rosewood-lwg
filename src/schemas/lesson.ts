import { z } from "zod";
import { languageSchema } from "./language";
import { levelSchema } from "./level";

export const lessonContentNodeTypeSchema = z.enum([
  "locale",
  "title",
  "entries",
  "entry",
  "audio",
  "steps",
  "step",
  "form",
]);

export type LessonContentNodeType = z.infer<typeof lessonContentNodeTypeSchema>;

/**
 * Step
 */

export const LESSON_STEPS = [
  "introduction",
  "listening",
  "pronunciation",
  "writing",
];

export const LessonStepTypeSchema = z.enum(LESSON_STEPS);

export type LessonStepType = z.infer<typeof LessonStepTypeSchema>;

/**
 * Limits
 */

export const PronunciationLimitsSchema = z.object({
  minimumRecordTime: z.number().nonnegative(),
  maximumRecordTime: z.number().positive(),
});
export type PronunciationLimits = z.infer<typeof PronunciationLimitsSchema>;

export const WritingLimitsSchema = z.object({
  totalTips: z.number().int().nonnegative(),
  totalErrors: z.number().int().nonnegative(),
});
export type WritingLimits = z.infer<typeof WritingLimitsSchema>;

export const EntryLimitsSchema = z.object({
  minimumSuccessPercentage: z.number().min(0).max(100),
});
export type EntryLimits = z.infer<typeof EntryLimitsSchema>;

export const LessonChallengeLimitsSchema = z.object({
  pronunciation: PronunciationLimitsSchema,
  writing: WritingLimitsSchema,
  entry: EntryLimitsSchema,
});
export type LessonChallengeLimits = z.infer<typeof LessonChallengeLimitsSchema>;

/**
 * Lesson Definition
 *
 * Represents lesson.json.
 */

export const LessonDefinitionEntrySchema = z.object({
  sequence: z.number().int().nonnegative(),
  target: z.string().min(1),
});
export type LessonDefinitionEntry = z.infer<typeof LessonDefinitionEntrySchema>;

export const LessonDefinitionSchema = z.object({
  id: z.string().min(1),
  day: z.number().int().positive(),
  limits: LessonChallengeLimitsSchema.optional(),
  entries: z.record(z.string(), LessonDefinitionEntrySchema),
});
export type LessonDefinition = z.infer<typeof LessonDefinitionSchema>;

/**
 * Lesson Locale
 *
 * Represents the lesson section inside a locale file.
 */

export const LessonLocaleEntryStepSchema = z.object({
  text: z.string(),
  instruction: z.string(),
  meanings: z.array(z.string()).optional(),
  gender: z.string().optional(),
});
export type LessonLocaleEntryStep = z.infer<typeof LessonLocaleEntryStepSchema>;

export const LessonLocaleEntrySchema = z.object({
  reference: z.string(),
  steps: z.record(LessonStepTypeSchema, LessonLocaleEntryStepSchema),
});
export type LessonLocaleEntry = z.infer<typeof LessonLocaleEntrySchema>;

export const LessonLocaleSchema = z.object({
  title: z.string(),
  entries: z.record(z.string(), LessonLocaleEntrySchema),
});
export type LessonLocale = z.infer<typeof LessonLocaleSchema>;

/**
 * Lesson
 *
 * Domain model consumed by the game.
 */
export const LessonEntryStepSchema = LessonLocaleEntryStepSchema.extend({
  type: LessonStepTypeSchema,
});
export type LessonEntryStep = z.infer<typeof LessonEntryStepSchema>;

export const lessonEntrySchema = z.object({
  id: z.string(),
  target: z.string(),
  sequence: z.number().int().nonnegative(),
  audio: z.string().optional(),
  steps: z.array(LessonEntryStepSchema).optional(),
});
export type LessonEntry = z.infer<typeof lessonEntrySchema>;

export const lessonBaseSchema = z.object({
  id: z.string(),
  limits: LessonChallengeLimitsSchema,
  entries: z.record(z.string(), lessonEntrySchema).optional(),
});
export type LessonBase = z.infer<typeof lessonBaseSchema>;

export const lessonSchema = z.object({
  id: z.string(),
  limits: LessonChallengeLimitsSchema.optional(),
  entries: z.array(lessonEntrySchema),
});

export type Lesson = z.infer<typeof lessonSchema>;
export type LessonDetails = Omit<Lesson, "entries">;

export const lessonContentOptionsSchema = z.object({
  language: languageSchema,
  level: levelSchema,
  dayDirectory: z.string().regex(/^day_\d{2}$/),
});
export type LessonContentOptions = z.infer<typeof lessonContentOptionsSchema>;

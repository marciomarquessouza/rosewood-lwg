import { z } from "zod";

export const dayDirectorySchema = z.string().regex(/^day_\d{2}$/);

export type DayDirectory = z.infer<typeof dayDirectorySchema>;

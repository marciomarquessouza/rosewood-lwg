import { z } from "zod";

export const gameSceneSchema = z.enum(["CELL", "DREAM", "TRAIN", "ALL"]);

export type GameScene = z.infer<typeof gameSceneSchema>;

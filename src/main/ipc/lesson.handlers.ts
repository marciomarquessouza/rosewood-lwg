import { ipcMain } from "electron";
import { LessonBase, LessonContentOptions } from "../../schemas/lesson";
import { lessonsServices } from "../services/lessons";
import type { ExampleAudioIdentity } from "../services/lessons/generateAudio";

export function registerLessonHandlers() {
  ipcMain.handle(
    "lesson:update",
    async (
      _,
      targetPath: string,
      options: LessonContentOptions,
      lessonBase: LessonBase,
    ) => {
      return lessonsServices.updateLessonContent(
        targetPath,
        options,
        lessonBase,
      );
    },
  );

  ipcMain.handle(
    "lesson:generate-audio",
    async (
      _,
      targetPath: string,
      options: LessonContentOptions,
      target: string,
      example?: ExampleAudioIdentity,
    ) => {
      return lessonsServices.generateAudio(
        targetPath,
        options,
        target,
        example,
      );
    },
  );

  ipcMain.handle(
    "lesson:load-audio",
    async (_, targetPath: string, audioPath: string) => {
      return lessonsServices.loadAudio(targetPath, audioPath);
    },
  );
}

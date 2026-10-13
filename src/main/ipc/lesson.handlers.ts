import { ipcMain } from "electron";
import { LessonBase, LessonContentOptions } from "../../schemas/lesson";
import { lessonsServices } from "../services/lessons";

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
}

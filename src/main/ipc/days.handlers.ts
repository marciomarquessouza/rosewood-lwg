import { ipcMain } from "electron";
import { daysService } from "../services/days";
import { ProjectOptions } from "../../schemas/project";
import { DayLessonContent } from "../../schemas/day";

export function registerDaysHandlers() {
  ipcMain.handle(
    "days:get-content",
    (_, targetPath: string, options: ProjectOptions) =>
      daysService.getDaysContent(targetPath, options),
  );

  ipcMain.handle(
    "days:create-content",
    (
      _,
      targetPath: string,
      options: ProjectOptions,
      content: DayLessonContent,
    ) => daysService.createDayContent(targetPath, options, content),
  );

  ipcMain.handle(
    "days:update-content",
    (
      _,
      targetPath: string,
      options: ProjectOptions,
      content: DayLessonContent,
    ) => daysService.updateDayContent(targetPath, options, content),
  );

  ipcMain.handle(
    "days:delete-content",
    (_, targetPath: string, options: ProjectOptions, dayDirectory: string) =>
      daysService.deleteDayContent(targetPath, options, dayDirectory),
  );
}

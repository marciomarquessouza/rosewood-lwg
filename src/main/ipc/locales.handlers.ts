import { ipcMain } from "electron";
import { localesServices } from "../services/locales";
import { DayLessonLocales, LocaleContentOptions } from "../../schemas/locales";

export function registerLocalesHandlers() {
  ipcMain.handle(
    "locales:update",
    async (
      _,
      targetPath: string,
      options: LocaleContentOptions,
      content: DayLessonLocales,
    ) => {
      return localesServices.updateLocaleContent(targetPath, options, content);
    },
  );
}

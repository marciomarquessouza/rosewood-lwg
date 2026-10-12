import { ipcMain } from "electron";
import { settingsServices } from "../services/settings";
import { AppSettings } from "../../shared/settings";

export function registerSettingsHandlers() {
  ipcMain.handle("settings:get", async () => {
    return settingsServices.getSettings();
  });

  ipcMain.handle(
    "settings:update",
    async (_, updates: Partial<AppSettings>) => {
      return settingsServices.updateSettings(updates);
    },
  );
}

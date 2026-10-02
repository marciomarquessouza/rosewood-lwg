import { app } from "electron";
import path from "node:path";

export function getSettingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}

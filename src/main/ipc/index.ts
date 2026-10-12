import { registerAppHandlers } from "./app.handlers";
import { registerProjectHandlers } from "./project.handlers";
import { registerDaysHandlers } from "./days.handlers";
import { registerSettingsHandlers } from "./settings.handlers";

export function registerIpcHandlers() {
  registerAppHandlers();
  registerProjectHandlers();
  registerDaysHandlers();
  registerSettingsHandlers();
}

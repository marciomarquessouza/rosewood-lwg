import { registerAppHandlers } from "./app.handlers";
import { registerProjectHandlers } from "./project.handlers";
import { registerDaysHandlers } from "./days.handlers";
import { registerSettingsHandlers } from "./settings.handlers";
import { registerLocalesHandlers } from "./locales.handlers";
import { registerLessonHandlers } from "./lesson.handlers";

export function registerIpcHandlers() {
  registerAppHandlers();
  registerProjectHandlers();
  registerDaysHandlers();
  registerSettingsHandlers();
  registerLessonHandlers();
  registerLocalesHandlers();
}

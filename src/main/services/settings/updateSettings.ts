import fs from "node:fs/promises";
import { AppSettings } from "../../../shared/settings";
import { getSettings } from "./getSettings";
import { getSettingsPath } from "./getSettingsPath";
import { getUserDataPath } from "../utils/getUserDataPath";

export async function updateSettings(
  updates: Partial<AppSettings>,
): Promise<AppSettings> {
  const currentSetting = await getSettings();
  const settings = {
    ...currentSetting,
    ...updates,
  };

  await fs.mkdir(getUserDataPath(), {
    recursive: true,
  });

  fs.writeFile(getSettingsPath(), JSON.stringify(settings, null, 2), "utf-8");

  return settings;
}

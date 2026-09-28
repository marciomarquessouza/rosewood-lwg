import { app } from "electron";
import fs from "node:fs/promises";
import path from "node:path";

import { AppSettings } from "../../shared/settings";

const DEFAULT_SETTINGS: AppSettings = {
  projectPath: null,
};

function getSettingsPath() {
  return path.join(app.getPath("userData"), "settings.json");
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const content = await fs.readFile(getSettingsPath(), "utf-8");

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(content),
    };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}

export async function updateSettings(
  updates: Partial<AppSettings>,
): Promise<AppSettings> {
  const currentSetting = await getSettings();
  const settings = {
    ...currentSetting,
    ...updates,
  };

  await fs.mkdir(app.getPath("userData"), {
    recursive: true,
  });

  fs.writeFile(getSettingsPath(), JSON.stringify(settings, null, 2), "utf-8");

  return settings;
}

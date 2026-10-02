import fs from "node:fs/promises";
import { AppSettings } from "../../../shared/settings";
import { getSettingsPath } from "./getSettingsPath";
import { DEFAULT_SETTINGS } from "./constants";

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

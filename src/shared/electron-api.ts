import { Language } from "../schemas/language";
import { Level } from "../schemas/level";
import { ProjectContent } from "../schemas/project";
import { ProjectContentLines, ProjectInfo } from "./project";
import { AppSettings } from "./settings";

export interface Rosewood {
  getAppVersion(): Promise<string>;
  selectProjectDirectory(): Promise<string | null>;
  // Settings
  getSettings(): Promise<AppSettings>;
  updateSettings(updates: Partial<AppSettings>): Promise<AppSettings>;
  // Projects
  openProject(path: string): Promise<ProjectInfo>;
  getProjectContent(path: string): Promise<ProjectContentLines>;
  saveProjectContent(path: string, content: ProjectContent): Promise<void>;
  deleteProjectContent(
    path: string,
    language: Language,
    level: Level,
  ): Promise<void>;
}

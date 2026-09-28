import { ProjectContent, ProjectInfo } from "./project";
import { AppSettings } from "./settings";

export interface Rosewood {
  getAppVersion(): Promise<string>;
  selectProjectDirectory(): Promise<string | null>;
  openProject(path: string): Promise<ProjectInfo>;
  getProjectContent(path: string): Promise<ProjectContent>;
  getSettings(): Promise<AppSettings>;
  updateSettings(updates: Partial<AppSettings>): Promise<AppSettings>;
}

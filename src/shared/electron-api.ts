import { DayLessonContent, DaysContent } from "../schemas/day";
import { Language } from "../schemas/language";
import { Level } from "../schemas/level";
import { ProjectContent, ProjectOptions } from "../schemas/project";
import { ProjectContentLines, ProjectInfo } from "./project";
import { AppSettings } from "./settings";

export type PushResponseType = "empty-tree" | "pushed";

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
  pullProjectContent(path: string): Promise<string>;
  pushProjectContent(path: string): Promise<PushResponseType>;
  deleteProjectContent(
    path: string,
    language: Language,
    level: Level,
  ): Promise<void>;
  // Days
  getDaysContent(path: string, options: ProjectOptions): Promise<DaysContent>;
  createDayContent(
    path: string,
    options: ProjectOptions,
    content: DayLessonContent,
  ): Promise<void>;
  updateDayContent(
    path: string,
    options: ProjectOptions,
    content: DayLessonContent,
  ): Promise<void>;
}

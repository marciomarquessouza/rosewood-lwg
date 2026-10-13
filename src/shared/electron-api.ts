import { DayLessonContent, DaysContent } from "../schemas/day";
import { Language } from "../schemas/language";
import { Level } from "../schemas/level";
import { DayLessonLocales, LocaleContentOptions } from "../schemas/locales";
import { ProjectContent, ProjectOptions } from "../schemas/project";
import { ProjectContentLines, ProjectInfo } from "./project";
import { AppSettings } from "./settings";

export type PushResponseType = "empty-tree" | "pushed";

export interface Rosewood {
  // api
  getAppVersion(): Promise<string>;
  selectProjectDirectory(): Promise<string | null>;
  // settings
  getSettings(): Promise<AppSettings>;
  updateSettings(updates: Partial<AppSettings>): Promise<AppSettings>;
  // projects
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
  // days
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
  deleteDayContent(
    targetPath: string,
    options: ProjectOptions,
    dayDirectory: string,
  ): Promise<void>;
  // locales
  updateLocaleContent(
    targetPath: string,
    options: LocaleContentOptions,
    content: DayLessonLocales,
  ): Promise<void>;
}

import { ProjectInfo } from "./project";

export interface Rosewood {
  getAppVersion(): Promise<string>;
  selectProjectDirectory(): Promise<string | null>;
  openProject(path: string): Promise<ProjectInfo>;
}

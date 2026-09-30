import { ProjectContent } from "../schemas/project";

export interface ProjectInfo {
  path: string;
  contentPath: string;
}

export interface ProjectContentLines {
  lines: ProjectContent[];
}

import type { CharacterProfile } from "../schemas/characterProfile";
import { ProjectContent } from "../schemas/project";

export interface ProjectInfo {
  path: string;
  contentPath: string;
}

export interface ProjectContentLines {
  lines: ProjectContent[];
  characters: CharacterProfile[];
}

import type { GameDesignDocument } from "./gameDesign";
import type { GameDesignDocument } from "./gameDesign";
import type { CharacterProfile } from "../schemas/characterProfile";
import { ProjectContent } from "../schemas/project";

export interface ProjectInfo {
  path: string;
  contentPath: string;
}

export interface ProjectContentLines {
  lines: ProjectContent[];
  characters: CharacterProfile[];
  gameDesign: GameDesignDocument[];
  gameDesign: GameDesignDocument[];
}

import { Language } from "../schemas/language";
import { Level } from "../schemas/level";

export interface ProjectInfo {
  path: string;
  contentPath: string;
}

export interface ProjectContent {
  lessonLanguages: {
    language: Language;
    levels: Level[];
  }[];
}

export interface ProjectInfo {
  path: string;
  contentPath: string;
}

export interface ProjectContent {
  lessonLanguages: {
    language: string;
    levels: string[];
  }[];
}

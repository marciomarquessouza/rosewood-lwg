import { Level, SUPPORTED_LEVELS } from "../../../../schemas/level";
import { Language } from "../../../../schemas/language";
import { ProjectContentLines } from "../../../../shared/project";

interface GetSupportedLevelsOptions {
  language: Language;
  projectContent: ProjectContentLines | null;
  currentLevel?: Level | null;
}

export function getSupportedLevels({
  language,
  projectContent,
  currentLevel,
}: GetSupportedLevelsOptions): Level[] {
  return SUPPORTED_LEVELS.filter((level) => {
    if (level === currentLevel) {
      return true;
    }

    return !projectContent?.lines.some(
      (project) => project.language === language && project.level === level,
    );
  });
}

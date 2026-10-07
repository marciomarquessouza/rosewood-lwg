import { DayLessonContent } from "../../../schemas/day";
import { ProjectOptions } from "../../../schemas/project";
import { openProject } from "../project/openProject";

export async function updateDayContent(
  targetPath: string,
  options: ProjectOptions,
  content: DayLessonContent,
): Promise<DayLessonContent> {
  const { contentPath } = await openProject(targetPath);
  void options;
  void contentPath;
  return content;
}

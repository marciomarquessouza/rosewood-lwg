import { DaysContent } from "../../../schemas/day";
import { ProjectOptions } from "../../../schemas/project";
import { openProject } from "../project/openProject";

export async function getDaysContent(
  projectPath: string,
  options: ProjectOptions,
): Promise<DaysContent> {
  await openProject(projectPath);
  return {
    ...options,
    days: [],
  };
}

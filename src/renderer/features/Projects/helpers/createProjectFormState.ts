import { ProjectContent } from "../../../../schemas/project";
import { ProjectFormState } from "../hook/projectFormReducer";

export const createProjectFormState = (
  project: ProjectContent,
): ProjectFormState => {
  return {
    language: project.language ?? "de-DE",
    level: project.level ?? "A1-1",
    description: project.description ?? "",
    lore: project.lore ?? "",
    lessonPlan: project.lessonPlan ?? "",
    plannedDays: project.plannedDays ?? 20,
    locales: project.locales ?? [],
    selectedLocale: "de-DE",
  };
};

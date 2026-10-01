import { ProjectContent } from "../../../../schemas/project";
import { ProjectFormState } from "../hook/projectFormReducer";

export const createProjectFormState = (
  project: ProjectContent,
): ProjectFormState => {
  return {
    description: project.description ?? "",
    lore: project.lore ?? "",
    lessonPlan: project.lessonPlan ?? "",
    plannedDays: project.plannedDays ?? 20,
    locales: project.locales ?? [],
    selectedLocale: "de-DE",
  };
};

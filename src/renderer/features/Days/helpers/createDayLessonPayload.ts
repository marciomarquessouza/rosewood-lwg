import { DayDirectory, DayLessonContent } from "../../../../schemas/day";
import { ProjectContent } from "../../../../schemas/project";
import { DayFormState } from "../reducers/dayFormReducer";
import { createDefaultLocalesContent } from "./createDefaultLocalesContent";

interface DayLessonPayloadOptions {
  day: number;
  dayDirectory: DayDirectory;
  form: DayFormState;
  project?: ProjectContent;
}

export function createDayLessonPayload({
  day,
  dayDirectory,
  form,
  project,
}: DayLessonPayloadOptions): DayLessonContent {
  return {
    day,
    dayDirectory,
    label: form.label,
    description: form.description,
    lessonTargets: form.lessonTargets,
    loreTargets: form.loreTargets,
    lesson: {
      id: dayDirectory,
      limits: form.limits,
      entries: form.entries,
    },
    dialogues: form.dialogues,
    locales: project?.locales
      ? createDefaultLocalesContent(project.locales)
      : {},
  };
}

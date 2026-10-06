import { DayDirectory } from "../../../../schemas/day";
import { DayLessonContent } from "../../../../shared/day";
import { DayFormState } from "../reducers/dayFormReducer";

export function createDayLessonPayload(
  day: number,
  dayDirectory: DayDirectory,
  form: DayFormState,
): DayLessonContent {
  return {
    day,
    dayDirectory,
    code: form.code,
    lessonTargets: form.lessonTargets,
    loreTargets: form.loreTargets,
    lesson: {
      id: String(day),
      limits: form.limits,
      entries: form.entries,
    },
    dialogues: form.dialogues,
    locales: {},
  };
}

import { useEffect, useMemo, useReducer, useRef } from "react";

import {
  dayFormReducer,
  DayFormState,
  INITIAL_FORM,
} from "../reducers/dayFormReducer";

import { useDaysContent } from "../../../contexts/DaysContentContext";
import { useProjectInfo } from "../../../contexts/ProjectInfoContext";

import { ProjectOptions } from "../../../../schemas/project";
import { DayLessonContent, DayDirectory } from "../../../../schemas/day";

const transformDayContentToFormState = (
  content: DayLessonContent,
): DayFormState => ({
  label: content.label,
  description: content.description,
  lessonTargets: content.lessonTargets,
  loreTargets: content.loreTargets,

  limits: content.lesson.limits,
  entries: content.lesson.entries,

  dialogues: content.dialogues,
});

export function useDayForm(
  options: ProjectOptions,
  dayDirectory: DayDirectory,
) {
  const [state, dispatch] = useReducer(dayFormReducer, INITIAL_FORM);

  const { daysContent, loading, loadDaysContent } = useDaysContent();

  const { projectPath } = useProjectInfo();

  const initializedKeyRef = useRef<string | null>(null);

  const isCurrentContent =
    daysContent?.language === options.language &&
    daysContent?.level === options.level;

  const currentDay = useMemo(() => {
    if (!isCurrentContent) {
      return null;
    }

    return (
      daysContent.days.find((day) => day.dayDirectory === dayDirectory) ?? null
    );
  }, [daysContent, dayDirectory, isCurrentContent]);

  useEffect(() => {
    if (!projectPath) return;

    if (!isCurrentContent) {
      void loadDaysContent(projectPath, options);
      return;
    }

    const initializationKey = [
      options.language,
      options.level,
      dayDirectory,
    ].join(":");

    if (initializedKeyRef.current === initializationKey) {
      return;
    }

    if (currentDay) {
      dispatch({
        type: "INITIALIZE",
        payload: transformDayContentToFormState(currentDay),
      });
    } else {
      dispatch({
        type: "INITIALIZE",
        payload: INITIAL_FORM,
      });
    }

    initializedKeyRef.current = initializationKey;
  }, [
    projectPath,
    options.language,
    options.level,
    dayDirectory,
    isCurrentContent,
    currentDay,
    loadDaysContent,
  ]);

  const updateField = <K extends keyof DayFormState>(
    field: K,
    value: DayFormState[K],
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      field,
      value,
    });
  };

  const updateLimit = <
    K extends keyof DayFormState["limits"],
    F extends keyof DayFormState["limits"][K],
  >(
    section: K,
    field: F,
    value: DayFormState["limits"][K][F],
  ) => {
    dispatch({
      type: "UPDATE_LIMIT",
      section,
      field: field as string,
      value: value as number,
    });
  };

  return {
    state,
    loading,

    updateField,
    updateLimit,
  };
}

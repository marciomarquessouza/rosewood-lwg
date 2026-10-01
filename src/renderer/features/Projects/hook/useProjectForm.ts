import { useEffect, useReducer } from "react";
import {
  initialState,
  projectFormReducer,
  ProjectFormState,
} from "./projectFormReducer";
import { Language, SUPPORTED_LANGUAGES } from "../../../../schemas/language";
import { LANGUAGE_DETAILS } from "../../../../constants";
import { Level, SUPPORTED_LEVELS } from "../../../../schemas/level";
import { useProjectContent } from "../../../contexts/ProjectContentContext";
import { createProjectFormState } from "../helpers/createProjectFormState";

interface ProjectFormOptions {
  projectLng?: Language | null;
  projectLevel?: Level | null;
  isUpdate: boolean;
}

export function useProjectForm({
  projectLng,
  projectLevel,
  isUpdate,
}: ProjectFormOptions) {
  const { projectContent } = useProjectContent();
  const [state, dispatch] = useReducer(projectFormReducer, initialState);
  const supportedLanguages = SUPPORTED_LANGUAGES.map((language) => ({
    value: language,
    label: LANGUAGE_DETAILS[language].name,
  }));
  const supportedLevels = SUPPORTED_LEVELS.map((level) => ({
    value: level,
    label: level,
  }));
  const supportedLocales = SUPPORTED_LANGUAGES.filter(
    (language) => !state.locales.includes(language) && language !== projectLng,
  ).map((language) => ({
    value: language,
    label: LANGUAGE_DETAILS[language].name,
  }));

  const setField = (
    field: keyof ProjectFormState,
    value: ProjectFormState[keyof ProjectFormState],
  ) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const addLocale = (locale: Language) => {
    dispatch({ type: "ADD_LOCALE", locale });

    const nextLocale = SUPPORTED_LANGUAGES.find(
      (language) => language !== locale && !state.locales.includes(language),
    );

    if (nextLocale) {
      dispatch({
        type: "SET_FIELD",
        field: "selectedLocale",
        value: nextLocale,
      });
    }
  };

  const removeLocale = (locale: Language) => {
    dispatch({ type: "REMOVE_LOCALE", locale });
  };

  useEffect(() => {
    if (!isUpdate || !projectContent || !projectLng || !projectLevel) {
      return;
    }

    const project = projectContent.lines.find(
      ({ language, level }) =>
        language === projectLng && level === projectLevel,
    );

    if (!project) {
      return;
    }

    dispatch({
      type: "INITIALIZE",
      payload: createProjectFormState(project),
    });
  }, [isUpdate, projectContent, projectLng, projectLevel]);

  return {
    state,
    setField,
    addLocale,
    removeLocale,
    supportedLanguages,
    supportedLocales,
    supportedLevels,
  };
}

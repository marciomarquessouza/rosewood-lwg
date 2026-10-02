import { useEffect, useReducer, useState } from "react";
import z from "zod";

import { LANGUAGE_DETAILS } from "../../../../constants";
import { Language, SUPPORTED_LANGUAGES } from "../../../../schemas/language";
import { Level } from "../../../../schemas/level";
import {
  ProjectContent,
  projectContentSchema,
} from "../../../../schemas/project";
import { FeedbackTypes } from "../../../components/Feedback";
import { useProjectContent } from "../../../contexts/ProjectContentContext";
import { useProjectInfo } from "../../../contexts/ProjectInfoContext";
import { createProjectFormState } from "../helpers/createProjectFormState";
import {
  initialState,
  projectFormReducer,
  ProjectFormState,
} from "./projectFormReducer";
import { getSupportedLevels } from "../helpers/getSupportedLevels";

interface ProjectFormOptions {
  projectLng?: Language | null;
  projectLevel?: Level | null;
  isUpdate: boolean;
}

const SUPPORTED_LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map((language) => ({
  value: language,
  label: LANGUAGE_DETAILS[language].name,
}));

function getFormErrors(error: z.ZodError): ProjectFormState["errors"] {
  const { fieldErrors } = z.flattenError(error);

  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, messages]) => [
      field,
      (messages as Array<string>)?.[0],
    ]),
  ) as ProjectFormState["errors"];
}

export function useProjectForm({
  projectLng,
  projectLevel,
  isUpdate,
}: ProjectFormOptions) {
  const { projectPath } = useProjectInfo();
  const { projectContent, loadProjectContent } = useProjectContent();

  const [state, dispatch] = useReducer(projectFormReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [apiFeedback, setApiFeedback] = useState<{
    type: FeedbackTypes;
    message: string;
  } | null>(null);

  const supportedLevels = getSupportedLevels({
    language: state.language,
    projectContent,
    currentLevel: isUpdate ? projectLevel : null,
  }).map((level) => ({
    value: level,
    label: level,
  }));

  const supportedLocales = SUPPORTED_LANGUAGES.filter(
    (language) =>
      language !== state.language && !state.locales.includes(language),
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

    const nextLocale = supportedLocales.find(({ value }) => value !== locale);

    if (nextLocale) {
      dispatch({
        type: "SET_FIELD",
        field: "selectedLocale",
        value: nextLocale.value,
      });
    }
  };

  const setLanguage = (language: Language) => {
    const levels = getSupportedLevels({
      language,
      projectContent,
    });

    const locales = SUPPORTED_LANGUAGES.filter(
      (locale) => locale !== language && !state.locales.includes(locale),
    );

    dispatch({
      type: "SET_FIELD",
      field: "language",
      value: language,
    });

    dispatch({
      type: "SET_FIELD",
      field: "level",
      value: levels[0],
    });

    dispatch({
      type: "SET_FIELD",
      field: "selectedLocale",
      value: locales[0],
    });
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

  const validate = (projectForm: ProjectFormState): ProjectContent | null => {
    const result = projectContentSchema.safeParse(projectForm);

    if (!result.success) {
      dispatch({
        type: "SET_ERRORS",
        errors: getFormErrors(result.error),
      });

      return null;
    }

    dispatch({ type: "SET_ERRORS", errors: {} });

    return result.data;
  };

  const handleSubmit = async () => {
    const content = validate(state);

    if (!content) {
      return;
    }

    try {
      setApiFeedback(null);
      setLoading(true);

      await window.rosewood.saveProjectContent(projectPath, content);
      await loadProjectContent();

      const projectReference = `${content.language}|${content.level}`;

      setApiFeedback({
        type: "success",
        message: `Scarlett ${isUpdate ? "updated" : "created"} the project ${projectReference}`,
      });
    } catch (error) {
      console.error(error);

      setApiFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unexpected error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    state,
    loading,
    apiFeedback,
    supportedLanguages: SUPPORTED_LANGUAGE_OPTIONS,
    supportedLevels,
    supportedLocales,
    setField,
    setLanguage,
    addLocale,
    removeLocale,
    handleSubmit,
  };
}

import { useReducer } from "react";
import {
  initialState,
  projectFormReducer,
  ProjectFormState,
} from "./projectFormReducer";
import { Language, SUPPORTED_LANGUAGES } from "../../../../schemas/language";
import { LANGUAGE_DETAILS } from "../../../../constants";

export function useProjectForm() {
  const [state, dispatch] = useReducer(projectFormReducer, initialState);
  const supportedLanguages = SUPPORTED_LANGUAGES.filter(
    (language) => !state.locales.includes(language),
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

  return {
    state,
    setField,
    addLocale,
    removeLocale,
    supportedLanguages,
  };
}

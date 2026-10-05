import { Language, SUPPORTED_LANGUAGES } from "../../../../schemas/language";
import { Level } from "../../../../schemas/level";

export type ProjectFormField = Exclude<keyof ProjectFormState, "errors">;

export type ProjectFormState = {
  language: Language;
  level: Level;
  lore: string;
  lessonPlan: string;
  plannedDays: number;
  selectedLocale: Language | null;
  locales: Language[];
  errors: Partial<Record<ProjectFormField, string>>;
};

export const initialState: ProjectFormState = {
  language: "de-DE",
  level: "A1-1",
  lore: "",
  lessonPlan: "",
  plannedDays: 20,
  selectedLocale: SUPPORTED_LANGUAGES[0] ?? null,
  locales: [],
  errors: {},
};

type ProjectFormAction =
  | {
      type: "INITIALIZE";
      payload: ProjectFormState;
    }
  | {
      type: "SET_FIELD";
      field: keyof ProjectFormState;
      value: ProjectFormState[keyof ProjectFormState];
    }
  | {
      type: "ADD_LOCALE";
      locale: Language;
    }
  | {
      type: "REMOVE_LOCALE";
      locale: Language;
    }
  | {
      type: "SET_ERRORS";
      errors: ProjectFormState["errors"];
    }
  | {
      type: "RESET";
      state: ProjectFormState;
    };

export function projectFormReducer(
  state: ProjectFormState,
  action: ProjectFormAction,
): ProjectFormState {
  switch (action.type) {
    case "INITIALIZE":
      return action.payload;
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "ADD_LOCALE":
      return {
        ...state,
        locales: [...state.locales, action.locale],
      };

    case "REMOVE_LOCALE":
      return {
        ...state,
        locales: state.locales.filter((locale) => locale !== action.locale),
      };

    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors,
      };

    case "RESET":
      return action.state;
  }
}

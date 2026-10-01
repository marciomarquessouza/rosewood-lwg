import { Language, SUPPORTED_LANGUAGES } from "../../../../schemas/language";
import { Level } from "../../../../schemas/level";

export type ProjectFormState = {
  language: Language;
  level: Level;
  description: string;
  lore: string;
  lessonPlan: string;
  plannedDays: number;
  selectedLocale: Language | null;
  locales: Language[];
};

export const initialState: ProjectFormState = {
  language: "de-DE",
  level: "A1-1",
  description: "",
  lore: "",
  lessonPlan: "",
  plannedDays: 20,
  selectedLocale: SUPPORTED_LANGUAGES[0] ?? null,
  locales: [],
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

    case "RESET":
      return action.state;
  }
}

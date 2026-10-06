import { DEFAULT_DIALOGUES } from "../../../../constants/dialogues";
import { DialoguesBase } from "../../../../schemas/dialogues";
import { LessonEntryBase } from "../../../../schemas/lesson";

export type DayFormState = {
  code: string;
  lessonTargets: string;
  loreTargets: string;
  limits: {
    pronunciation: {
      minimumRecordTime: number;
      maximumRecordTime: number;
    };
    writing: {
      totalErrors: number;
      totalTips: number;
    };
    entry: {
      minimumSuccessPercentage: number;
    };
  };
  entries: Record<string, LessonEntryBase>;
  dialogues: DialoguesBase;
};

export const INITIAL_FORM: DayFormState = {
  code: "",
  lessonTargets: "",
  loreTargets: "",
  limits: {
    pronunciation: {
      minimumRecordTime: 1000,
      maximumRecordTime: 6000,
    },
    writing: {
      totalErrors: 3,
      totalTips: 3,
    },
    entry: {
      minimumSuccessPercentage: 0.6,
    },
  },
  entries: {},
  dialogues: DEFAULT_DIALOGUES,
};

type Action =
  | {
      type: "UPDATE_FIELD";
      field: keyof DayFormState;
      value: DayFormState[keyof DayFormState];
    }
  | {
      type: "UPDATE_LIMIT";
      section: keyof DayFormState["limits"];
      field: string;
      value: number;
    };

export function dayFormReducer(
  state: DayFormState,
  action: Action,
): DayFormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "UPDATE_LIMIT":
      return {
        ...state,
        limits: {
          ...state.limits,
          [action.section]: {
            ...state.limits[action.section],
            [action.field]: action.value,
          },
        },
      };

    default:
      return state;
  }
}

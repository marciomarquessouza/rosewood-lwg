import { useReducer } from "react";
import {
  dayFormReducer,
  DayFormState,
  INITIAL_FORM,
} from "../reducers/dayFormReducer";

export function useDayForm() {
  const [state, dispatch] = useReducer(dayFormReducer, INITIAL_FORM);

  const updateField = <K extends keyof DayFormState>(
    field: K,
    value: DayFormState[K],
  ) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
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

    updateField,
    updateLimit,
  };
}

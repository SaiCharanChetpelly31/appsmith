import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import type { LintErrorsStore } from "widgets/types";
import { createImmerReducer } from "utils/ReducerUtils";
import type { SetLintErrorsAction } from "actions/lintingActions";
import { isEqual } from "lodash";

const initialState: LintErrorsStore = {};

export const lintErrorReducer = createImmerReducer(initialState, {
  [ReduxActionTypes.FETCH_PAGE_INIT]: () => initialState,
  [ReduxActionTypes.SET_LINT_ERRORS]: (
    state: LintErrorsStore,
    action: SetLintErrorsAction,
  ) => {
    const { errors } = action.payload;
    for (const entityPath of Object.keys(errors)) {
      const entityPathLintErrors = errors[entityPath];
      if (isEqual(entityPathLintErrors, state[entityPath])) continue;
      state[entityPath] = entityPathLintErrors;
    }
  },
});

import { createImmerReducer } from "utils/ReducerUtils";
import {
  ReduxActionTypes,
  UpdateCanvasPayload,
  ReduxAction,
} from "@appsmith/constants/ReduxActionConstants";
import { WidgetProps } from "widgets/BaseWidget";

export type PseudoCanvasWidgetsReduxState = {
  [widgetId: string]: FlattenedWidgetProps;
};

export type FlattenedWidgetProps<orType = never> =
  | (WidgetProps & {
      children?: string[];
    })
  | orType;

type AddPseudoWidgetPayload = {
  parentWidgetId: string;
  widgetProps: WidgetProps | WidgetProps[];
};

const initialState: PseudoCanvasWidgetsReduxState = {};

const pseudoCanvasWidgetsReducer = createImmerReducer(initialState, {
  [ReduxActionTypes.ADD_PSEUDO_WIDGET]: (
    state: PseudoCanvasWidgetsReduxState,
    action: ReduxAction<AddPseudoWidgetPayload>,
  ) => {
    return action.payload;
  },
  [ReduxActionTypes.UPDATE_PSEUDO_WIDGET]: (
    state: PseudoCanvasWidgetsReduxState,
    action: ReduxAction<UpdateCanvasPayload>,
  ) => {
    return action.payload.widgets;
  },
  [ReduxActionTypes.DELETE_PSEUDO_WIDGET]: (
    state: PseudoCanvasWidgetsReduxState,
    action: ReduxAction<UpdateCanvasPayload>,
  ) => {
    return action.payload.widgets;
  },
});

export default pseudoCanvasWidgetsReducer;

import type { ReduxAction } from "@appsmith/constants/ReduxActionConstants";
import { ReduxActionTypes } from "@appsmith/constants/ReduxActionConstants";
import type { BatchPropertyUpdatePayload } from "components/propertyControls/propertyControlTypes";
import type { UpdateWidgetsPayload } from "reducers/entityReducers/canvasWidgetsReducer";
import type { UpdateWidgetPropertyPayload } from "constants/PropertyControlConstants";

export const updateWidgetPropertyRequest = (
  widgetId: string,
  propertyPath: string,
  propertyValue: any,
): ReduxAction<UpdateWidgetPropertyRequestPayload> => {
  return {
    type: ReduxActionTypes.UPDATE_WIDGET_PROPERTY_REQUEST,
    payload: {
      widgetId,
      propertyPath,
      propertyValue,
    },
  };
};

export const batchUpdateWidgetProperty = (
  widgetId: string,
  updates: BatchPropertyUpdatePayload,
  shouldReplay = true,
): ReduxAction<UpdateWidgetPropertyPayload> => ({
  type: ReduxActionTypes.BATCH_UPDATE_WIDGET_PROPERTY,
  payload: {
    widgetId,
    updates,
    shouldReplay,
  },
});

export const batchUpdateWidgetDynamicProperty = (
  widgetId: string,
  updates: BatchUpdateDynamicPropertyUpdates[],
): ReduxAction<BatchUpdateWidgetDynamicPropertyPayload> => ({
  type: ReduxActionTypes.BATCH_SET_WIDGET_DYNAMIC_PROPERTY,
  payload: {
    widgetId,
    updates,
  },
});
export const batchUpdateMultipleWidgetProperties = (
  updatesArray: UpdateWidgetPropertyPayload[],
): ReduxAction<{ updatesArray: UpdateWidgetPropertyPayload[] }> => ({
  type: ReduxActionTypes.BATCH_UPDATE_MULTIPLE_WIDGETS_PROPERTY,
  payload: {
    updatesArray,
  },
});

export const deleteWidgetProperty = (
  widgetId: string,
  propertyPaths: string[],
): ReduxAction<DeleteWidgetPropertyPayload> => ({
  type: ReduxActionTypes.DELETE_WIDGET_PROPERTY,
  payload: {
    widgetId,
    propertyPaths,
  },
});

export const setWidgetDynamicProperty = (
  widgetId: string,
  propertyPath: string,
  isDynamic: boolean,
  shouldRejectDynamicBindingPathList = true,
  skipValidation = false,
): ReduxAction<SetWidgetDynamicPropertyPayload> => {
  return {
    type: ReduxActionTypes.SET_WIDGET_DYNAMIC_PROPERTY,
    payload: {
      widgetId,
      propertyPath,
      isDynamic,
      shouldRejectDynamicBindingPathList,
      skipValidation,
    },
  };
};

export const updateMultipleWidgetPropertiesAction = (
  widgetsToUpdate: UpdateWidgetsPayload,
  shouldEval = false,
) => {
  return {
    type: ReduxActionTypes.UPDATE_MULTIPLE_WIDGET_PROPERTIES,
    payload: { widgetsToUpdate, shouldEval },
  };
};

export const updateMultipleMetaWidgetPropertiesAction = (
  widgetsToUpdate: UpdateWidgetsPayload,
  shouldEval = false,
) => {
  return {
    type: ReduxActionTypes.UPDATE_MULTIPLE_META_WIDGET_PROPERTIES,
    payload: { widgetsToUpdate, shouldEval },
  };
};

export interface UpdateWidgetPropertyRequestPayload {
  widgetId: string;
  propertyPath: string;
  propertyValue: any;
}

export interface UpdateCanvasLayoutPayload {
  width: number;
  height: number;
}

export interface SetWidgetDynamicPropertyPayload {
  widgetId: string;
  propertyPath: string;
  isDynamic: boolean;
  shouldRejectDynamicBindingPathList?: boolean;
  skipValidation?: boolean;
}

export type BatchUpdateDynamicPropertyUpdates = Omit<
  SetWidgetDynamicPropertyPayload,
  "widgetId"
>;

export interface BatchUpdateWidgetDynamicPropertyPayload {
  widgetId: string;
  updates: BatchUpdateDynamicPropertyUpdates[];
}

export interface DeleteWidgetPropertyPayload {
  widgetId: string;
  propertyPaths: string[];
}

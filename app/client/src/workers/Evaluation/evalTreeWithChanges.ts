import type { UnEvalTree } from "entities/DataTree/dataTreeTypes";
import { dataTreeEvaluator } from "./handlers/evalTree";
import type { EvalMetaUpdates } from "@appsmith/workers/common/DataTreeEvaluator/types";
import { makeEntityConfigsAsObjProperties } from "@appsmith/workers/Evaluation/dataTreeUtils";
import type { EvalTreeResponseData } from "./types";
import { MessageType, sendMessage } from "utils/MessageUtil";
import { MAIN_THREAD_ACTION } from "@appsmith/workers/Evaluation/evalWorkerActions";
import type { UpdateDataTreeMessageData } from "sagas/EvalWorkerActionSagas";
import {
  generateOptimisedUpdatesAndSetPrevState,
  getNewDataTreeUpdates,
  uniqueOrderUpdatePaths,
} from "./helpers";
import type DataTreeEvaluator from "workers/common/DataTreeEvaluator";
import type { JSUpdate } from "utils/JSPaneUtils";
import type { DataTreeDiff } from "@appsmith/workers/Evaluation/evaluationUtils";

const getDefaultEvalResponse = (): EvalTreeResponseData => ({
  updates: "[]",
  dependencies: {},
  errors: [],
  evalMetaUpdates: [],
  evaluationOrder: [],
  jsUpdates: {},
  logs: [],
  unEvalUpdates: [],
  isCreateFirstTree: false,
  staleMetaIds: [],
  removedPaths: [],
  isNewWidgetAdded: false,
  undefinedEvalValuesMap: {},
  jsVarsCreatedEvent: [],
});

export function evalTreeWithChanges(
  updatedValuePaths: string[][],
  metaUpdates: EvalMetaUpdates = [],
) {
  let setupUpdateTreeResponse = {} as UpdateTreeResponse;
  if (dataTreeEvaluator) {
    setupUpdateTreeResponse =
      dataTreeEvaluator.setupUpdateTreeWithDifferences(updatedValuePaths);
  }

  const setterAndLocalStorageUpdatePaths = uniqueOrderUpdatePaths(
    updatedValuePaths.map((val) => val.join(".")),
  );

  evaluateAndpushUpdatesToMainThread(
    dataTreeEvaluator,
    setupUpdateTreeResponse,
    metaUpdates,
    setterAndLocalStorageUpdatePaths,
  );
}

const pushResponseToMainThread = (
  evalTreeResponse: EvalTreeResponseData,
  unevalTree: UnEvalTree,
) => {
  const data: UpdateDataTreeMessageData = {
    workerResponse: evalTreeResponse,
    unevalTree,
  };

  sendMessage.call(self, {
    messageType: MessageType.DEFAULT,
    body: {
      data,
      method: MAIN_THREAD_ACTION.UPDATE_DATATREE,
    },
  });
};

const getAffectedNodesInTheDataTree = (
  unEvalUpdates: DataTreeDiff[],
  evalOrder: string[],
) => {
  const allUnevalUpdates = unEvalUpdates.map(
    (update) => update.payload.propertyPath,
  );
  return uniqueOrderUpdatePaths([...allUnevalUpdates, ...evalOrder]);
};
export interface UpdateTreeResponse {
  unEvalUpdates: DataTreeDiff[];
  evalOrder: string[];
  jsUpdates: Record<string, JSUpdate>;
}
export const evaluateAndpushUpdatesToMainThread = (
  dataTreeEvaluator: DataTreeEvaluator | undefined,
  setupUpdateTreeResponse: UpdateTreeResponse,
  metaUpdates: EvalMetaUpdates,
  additionalPathsAddedAsUpdates: string[],
) => {
  const defaultResponse = getDefaultEvalResponse();

  if (!dataTreeEvaluator) {
    const updates = generateOptimisedUpdatesAndSetPrevState(
      {},
      dataTreeEvaluator,
      [],
    );
    defaultResponse.updates = updates;
    defaultResponse.evalMetaUpdates = [...(metaUpdates || [])];

    return pushResponseToMainThread(defaultResponse, {});
  }

  const { evalOrder, jsUpdates, unEvalUpdates } = setupUpdateTreeResponse;
  defaultResponse.evaluationOrder = evalOrder;
  defaultResponse.unEvalUpdates = unEvalUpdates;
  defaultResponse.jsUpdates = jsUpdates;

  const updateResponse = dataTreeEvaluator.evalAndValidateSubTree(
    evalOrder,
    dataTreeEvaluator.oldConfigTree,
    unEvalUpdates,
  );

  const dataTree = makeEntityConfigsAsObjProperties(
    dataTreeEvaluator.evalTree,
    {
      evalProps: dataTreeEvaluator.evalProps,
    },
  );

  /** Make sure evalMetaUpdates is sanitized to prevent postMessage failure */
  defaultResponse.evalMetaUpdates = JSON.parse(
    JSON.stringify([...(metaUpdates || []), ...updateResponse.evalMetaUpdates]),
  );

  defaultResponse.staleMetaIds = updateResponse.staleMetaIds;
  const unevalTree = dataTreeEvaluator.getOldUnevalTree();

  const additionalUpdates = getNewDataTreeUpdates(
    additionalPathsAddedAsUpdates,
    dataTree,
  );
  const affectedNodePaths = getAffectedNodesInTheDataTree(
    unEvalUpdates,
    evalOrder,
  );

  defaultResponse.updates = generateOptimisedUpdatesAndSetPrevState(
    dataTree,
    dataTreeEvaluator,
    affectedNodePaths,
    additionalUpdates,
  );
  dataTreeEvaluator.undefinedEvalValuesMap =
    dataTreeEvaluator.undefinedEvalValuesMap || {};
  return pushResponseToMainThread(defaultResponse, unevalTree);
};

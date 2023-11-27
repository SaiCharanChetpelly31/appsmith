import type { ChangeEvent } from "react";
import React from "react";
import type { ControlProps } from "./BaseControl";
import BaseControl from "./BaseControl";
import type { EventOrValueHandler } from "redux-form";
import {
  EditorModes,
  EditorSize,
  TabBehaviour,
} from "components/editorComponents/CodeEditor/EditorConfig";
import LazyCodeEditor from "components/editorComponents/LazyCodeEditor";
import { assistiveBindingHinter } from "components/editorComponents/CodeEditor/assistiveBindingHinter";
import { bindingHintHelper } from "components/editorComponents/CodeEditor/hintHelpers";
import { slashCommandHintHelper } from "components/editorComponents/CodeEditor/commandsHelper";

class CodeEditorControl extends BaseControl<ControlProps> {
  render() {
    const {
      additionalControlData,
      dataTreePath,
      evaluatedValue,
      expected,
      propertyValue,
      useValidationMessage,
    } = this.props;

    const props: Partial<ControlProps> = {};

    if (dataTreePath) props.dataTreePath = dataTreePath;
    if (evaluatedValue) props.evaluatedValue = evaluatedValue;
    if (expected) props.expected = expected;

    const positionCursorInsideBinding =
      !!additionalControlData?.shouldFocusOnJSControl;

    return (
      <LazyCodeEditor
        additionalDynamicData={this.props.additionalAutoComplete}
        hinting={[
          bindingHintHelper,
          assistiveBindingHinter,
          slashCommandHintHelper,
        ]}
        input={{ value: propertyValue, onChange: this.onChange }}
        mode={EditorModes.TEXT_WITH_BINDING}
        positionCursorInsideBinding={positionCursorInsideBinding}
        size={EditorSize.EXTENDED}
        tabBehaviour={TabBehaviour.INDENT}
        theme={this.props.theme}
        useValidationMessage={useValidationMessage}
        {...props}
        AIAssisted
      />
    );
  }

  onChange: EventOrValueHandler<ChangeEvent<any>> = (
    value: string | ChangeEvent,
  ) => {
    this.updateProperty(this.props.propertyName, value, true);
  };

  static getControlType() {
    return "CODE_EDITOR";
  }
}

export default CodeEditorControl;

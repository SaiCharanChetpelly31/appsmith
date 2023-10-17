export * from "ce/pages/common/AppHeader";
import { Routes as CE_Routes } from "ce/pages/common/AppHeader";
import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import type { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import PackageEditorHeader from "../Editor/PackageEditorHeader";
import { PACKAGE_EDITOR_URL } from "@appsmith/constants/routes/packageRoutes";

type Props = RouteComponentProps;

const headerRoot = document.getElementById("header-root");

const Routes = () => {
  return (
    <Switch>
      <Route component={PackageEditorHeader} path={PACKAGE_EDITOR_URL} />
      <CE_Routes />
    </Switch>
  );
};

class AppHeader extends React.Component<Props, any> {
  private container = document.createElement("div");

  componentDidMount() {
    headerRoot?.appendChild(this.container);
  }
  componentWillUnmount() {
    headerRoot?.removeChild(this.container);
  }
  get header() {
    return <Routes />;
  }
  render() {
    return ReactDOM.createPortal(this.header, this.container);
  }
}

export default withRouter(AppHeader);

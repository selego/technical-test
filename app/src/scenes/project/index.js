import React from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import Edit from "./edit";
import ProjectList from "./list";
import ProjectView from "./view";

export default () => {
  const {role} = useSelector((state) => state.Auth.user);
  return (
    <Switch>
      {role ==="ADMIN" && <Route path="/project/edit/:id" component={Edit} />}
      <Route path="/project/:id" component={ProjectView} />
      <Route path="/" component={ProjectList} />
    </Switch>
  );
};

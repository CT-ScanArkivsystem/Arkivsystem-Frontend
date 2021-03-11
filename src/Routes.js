import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import CreateUser from "./containers/CreateUser";
import UserFrontpage from "./containers/UserFrontpage";
import CreateProject from "./containers/CreateProject";

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/userFrontpage">
                <UserFrontpage />
            </Route>
            <Route exact path="/createProject">
                <CreateProject />
            </Route>
            <Route exact path="/createUser">
                <CreateUser />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}
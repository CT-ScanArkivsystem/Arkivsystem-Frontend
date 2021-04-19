import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import CreateUser from "./components/AdminTabs/CreateUser";
import UserFrontpage from "./containers/UserFrontpage";
import CreateProject from "./containers/CreateProject";
import Project from "./containers/Project";
import AdminPage from "./containers/AdminPage";

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
            <Route exact path="/Project">
                <Project />
            </Route>
            <Route exact path="/createProject">
                <CreateProject />
            </Route>
            <Route exact path="/adminPage">
                <AdminPage />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
    );
}

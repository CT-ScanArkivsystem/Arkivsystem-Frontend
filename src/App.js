import React, { useState } from "react";
import {Nav, Navbar} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Routes from "./Routes";
import { AppContext } from "./libs/contextLib";
import "./App.css";
import {onError} from "./libs/errorLib";
import UserStore from "./stores/UserStore";

function App() {
    const [isAuthenticating, setIsAuthenticating] = useState(true);
    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const history = useHistory();

    //Functions in the useEffect() will be run once on load of site.
    React.useEffect(() => {
        checkLoginStatus();
    }, []);

    /**
     * Sends a GET request to the server that it wants to logout.
     * The server will send a new cookie that will overwrite the existing one and then get removed.
     * This process will ensure that the user no longer has a valid JWT token. Effectively logging the user out.
     * @returns {Promise<void>}
     */
    async function handleLogout() {
        userHasAuthenticated(false);
        try {
            let res = await fetch('http://localhost:8080/auth/logout', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                },
            });
            history.push("/login");
        }
        catch (e) {
            onError(e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
    }

    /**
     * Sends a GET request to the server to check if user has a JWT token.
     * If token exists, it will log the user in.
     * @returns {Promise<void>}
     */
    async function checkLoginStatus() {
        try {
            let res = await fetch('http://localhost:8080/user/currentUser', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                },
            });

            let result = await res.json();

            if (result !== null && result !== "") {
                console.log("User is logged in!");
                UserStore.email = result.email;
                UserStore.firstName = result.firstName;
                UserStore.lastName = result.lastName;
                userHasAuthenticated(true);
                //TODO: Create a is logged in request and get user information from it.
            }
            else {
                console.log("User is not logged in.");
            }
        }
        catch (e) {
            onError(e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
        setIsAuthenticating(false);
    }

  return (
      !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
            <LinkContainer to="/">
              <Navbar.Brand href="/" className="font-weight-bold text-muted">
                Scratch
              </Navbar.Brand>
            </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
              <Nav activeKey={window.location.pathname}>
                  {isAuthenticated ? (
                      <>
                          <LinkContainer to="/createUser">
                              <Nav.Link>Create user</Nav.Link>
                          </LinkContainer>
                          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                      </>
                  ) : (
                      <>
                          <LinkContainer to="/login">
                              <Nav.Link>Login</Nav.Link>
                          </LinkContainer>
                      </>
                  )}
              </Nav>
          </Navbar.Collapse>
        </Navbar>
          <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
              <Routes />
          </AppContext.Provider>
      </div>
      )
  );
}

export default App;
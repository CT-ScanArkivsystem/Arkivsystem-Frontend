import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Login.css";
import LoaderButton from "../components/LoaderButton";
import PostLogin from "../apiRequests/PostLogin";
import GetCurrentUser from "../apiRequests/GetCurrentUser";
import {set} from "mobx";

export default function Login() {
    const { userHasAuthenticated } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const history = useHistory();

    /**
     * Checks if both form inputs have something put into them.
     * @returns {boolean}
     */
    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    /**
     * Sends a POST request to the server with the users input email and password.
     * If the server responds with success: true it will log the user in. The response
     * sets a cookie in the users browser which will be sent automatically by the browser during future requests.
     * @param event
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        try {
            event.preventDefault();
            setIsLoading(true);
            let didUserGetLoggedIn = await PostLogin(email, password);

            switch (didUserGetLoggedIn.status) {
                case 200:
                    let couldGetCurrentUser = await GetCurrentUser();
                    if (couldGetCurrentUser) {
                        userHasAuthenticated(true);
                        history.push("/userFrontpage");
                    } else {
                        console.log("User is not logged in.");
                        setIsLoading(false);
                    }
                    //setErrorMessage("Login attempt worked but you didn't get logged in?")
                    break;
                case 401:
                    setErrorMessage("Email and/or password was incorrect.");
                    break;
                case 404:
                    setErrorMessage("Login attempt failed. Error code 404!");
                    break;
                case 500:
                    setErrorMessage("An internal server error occurred! Error code 500!");
                    break;
                default:
                    setErrorMessage("An unexpected error occurred! Unexpected error code!");
                    break;
            }
            setIsLoading(false);
        }
        catch (e) {
            setIsLoading(false);
            onError(e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
    }

    return (
        <div className="Login">
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        autoFocus
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Login
                </LoaderButton>
                <span className="errorMessage">{errorMessage}</span>
            </Form>
        </div>
    );
}

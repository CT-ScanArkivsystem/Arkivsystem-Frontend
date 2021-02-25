import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Login.css";
import LoaderButton from "../components/LoaderButton";
import PostLogin from "../apiRequests/PostLogin";
import GetCurrentUser from "../apiRequests/GetCurrentUser";

export default function Login() {
    const { userHasAuthenticated } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
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
            if (didUserGetLoggedIn) {
                let couldGetCurrentUser = await GetCurrentUser();
                if (couldGetCurrentUser) {
                    userHasAuthenticated(true);
                    history.push("/userFrontpage");
                } else {
                    console.log("User is not logged in. User should not be able to access this if statement if not logged in.");
                }
            } else {
                console.log("Did not log in");
                setIsLoading(false);
            }
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
            </Form>
        </div>
    );
}
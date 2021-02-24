import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./CreateUser.css";
import LoaderButton from "../components/LoaderButton";

export default function CreateUser() {
    const { userHasAuthenticated } = useAppContext();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    /**
     * Checks if both form inputs have something put into them.
     * @returns {boolean}
     */
    function validateForm() {
        return (firstName.length > 0 && lastName.length > 0 && email.length > 0 && password.length > 0 && role.length > 0);
    }

    /**
     * Sends a POST request to the server with the users input email and password.
     * If the server responds with success: true it will log the user in. The response
     * sets a cookie in the users browser which will be sent automatically by the browser during future requests.
     * @param event
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

            try {
                let res = await fetch ('http://localhost:8080/admin/newUser', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    //NB! In the backend the login system treats the email to login as username. 16.02.2021
                    //credentials: 'same-origin',
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        role: role
                    })
                });

                let result = await res.json();
                if (result && result.success) {
                    userHasAuthenticated(true);
                    history.push("/");
                }
                else if (!result || (result.success !== true)) {
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
        <div className="CreateUser">
            <Form onSubmit={handleSubmit}>
                <h2>Create a new user:</h2>
                <Form.Group size="lg" controlId="email">
                    <Form.Group size="lg" controlId="firstName">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="lastName">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Form.Group>
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
                <Form.Group size="lg" controlId="role">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                        type="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Create user
                </LoaderButton>
            </Form>
        </div>
    );
}
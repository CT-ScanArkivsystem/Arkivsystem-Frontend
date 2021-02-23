import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useAppContext } from "../libs/contextLib";
import "./Login.css";

export default function Login() {
    const { userHasAuthenticated } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    async function handleSubmit(event) {
        event.preventDefault();

            try {
                let res = await fetch ('http://localhost:8080/auth/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    //NB! In the backend the login system treats the email to login as username. 16.02.2021
                    //credentials: 'same-origin',
                    body: JSON.stringify({
                        username: email,
                        password: password
                    })
                });

                let result = await res.json();
                if (result && result.success) {
                    userHasAuthenticated(true);
                }
                else if (!result || (result.success !== true)) {
                    console.log("Did not log in");
                }
            }
            catch (e) {
                console.log("Something went wrong: " + e);
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
                <Button block size="lg" type="submit" disabled={!validateForm()}>
                    Login
                </Button>
            </Form>
        </div>
    );
}
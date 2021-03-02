import React, { useState } from "react";
import "./UserFrontpage.css";
import SearchBar from "../components/SearchBar";
import FilterCheckbox from "../components/FilterCheckbox";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";

export default function UserFrontpage() {
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    //Temporary test hooks
    const [testHook, setTestHook] = useState("test");


    async function handleSubmit(event) {
        event.preventDefault();
        console.log("HandleSubmit! in UserFrontpage")
    }

    function validateForm() {
        console.log("ValidateForm called! " + testHook)
        return true;
        // TODO: Validate when you know how to validate
        //return email.length > 0 && password.length > 0;
    }

    return (
        <div className="userFrontpage">
            <div className="sideBar">
                <Form onSubmit={handleSubmit}>
                    <Form.Group size="lg">
                        <Form.Control
                            type="search"
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group size="lg">
                        <Form.Check
                            type="checkbox"
                            label="Checkbox 1"
                            index="checkbox1"
                            value="testHook1"
                            onChange={(e) => setTestHook(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group size="lg">
                        <Form.Check
                            type="checkbox"
                            label="Checkbox 2"
                            index="checkbox2"
                            value="testHook2"
                            onChange={(e) => setTestHook(e.target.value)}
                        />
                    </Form.Group>
                    <LoaderButton
                        block
                        size="lg"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Search
                    </LoaderButton>
                </Form>
            </div>
            <div className="lander">
                <h1>Your frontpage!</h1>
                <p className="text-muted">Here you will find your projects!</p>
            </div>
        </div>
    );
}
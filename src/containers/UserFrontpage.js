import React, { useState } from "react";
import "./UserFrontpage.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import {Link} from "react-router-dom";
import FileDisplay from "../components/FileDisplay";

export default function UserFrontpage() {
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("HandleSubmit! in UserFrontpage")
    }

    function validateForm() {
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
                            //onChange={(e) => setTestHook(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group size="lg">
                        <Form.Check
                            type="checkbox"
                            label="Checkbox 2"
                            index="checkbox2"
                            value="testHook2"
                            //onChange={(e) => setTestHook(e.target.value)}
                        />
                    </Form.Group>
                    <LoaderButton
                        block
                        size="sm"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Search
                    </LoaderButton>
                </Form>
            </div>
            <div className="frontPageContainer">
                <div className="projectContainer">
                    <h1>Your frontpage!</h1>
                    <div className="projects">
                        <FileDisplay
                            className= "project1"
                            filetype = "folder"
                            projectname = "Test"
                            projectowner = "Aleksander Bakken"
                        />
                        <FileDisplay
                            className= "project2"
                            filetype = "gif"
                            projectname = "Birch"
                            projectowner = "Brage Tranvik"
                        />
                        <FileDisplay
                            className= "project3"
                            filetype = "jpeg"
                            projectname = "Planks"
                            projectowner = "Aleksander Bakken"
                        />
                        <FileDisplay
                            className= "project4"
                            filetype = "png"
                            projectname = "Wood"
                            projectowner = "Trym Vaaland"
                        />
                        <FileDisplay
                            className= "project5"
                            filetype = "tiff"
                            projectname = "Example Project Name"
                            projectowner = "Trym Vaaland"
                        />
                    </div>
                </div>
                <div className="projectFooter">
                    <Link to="/createProject">
                        <LoaderButton
                            size="sm"
                            isLoading={isLoading}
                        >
                            New project
                        </LoaderButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}
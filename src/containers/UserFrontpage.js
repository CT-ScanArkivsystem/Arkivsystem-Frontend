import React, { useState, Component } from "react";
import "./UserFrontpage.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import {Link} from "react-router-dom";
import FileDisplay from "../components/FileDisplay";
import GetAllProjects from "../apiRequests/GetAllProjects";
import {render} from "@testing-library/react";
import {onError} from "../libs/errorLib";

export default function UserFrontpage() {
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [doesHaveProjects, setDoesHaveProjects] = useState(false);

    const [allProjects, setAllProjects] = useState([]);
    const [generatedProjects, setGeneratedProjects] = useState([]);

    const [maxFiles, setMaxFiles] = useState(0);

    //Functions in the useEffect() will be run once on load of site.
    React.useEffect(() => {
        initGetAllProjects();
    }, []);

    async function initGetAllProjects() {
        if (!doesHaveProjects) {
            console.log("passes getAllProjects")
            setAllProjects(await GetAllProjects());
            setDoesHaveProjects(true);
            setIsLoading(false);
            console.log("doesHaveProjects: " + doesHaveProjects)
        }
    }

    function addNextFileDisplays() {
        setMaxFiles(maxFiles + 2);
        setGeneratedProjects([...allProjects]);
    }

    function renderFileDisplays(max) {
        let result = [];

        let i = 0;
        for (i; (i < max) && (i < generatedProjects.length); i++) {
            result.push(<FileDisplay
                    key={"projectNr" + i}
                    className="fileDisplay"
                    filetype="jpeg"
                    filename={generatedProjects[i].projectName}
                    fileowner="Random"
                />
            );
        }
            /*
        generatedProjects.forEach((fileToDisplay) => {
            result.push(
                <FileDisplay
                    key={fileToDisplay.projectId}
                    className="fileDisplay"
                    filetype="jpeg"
                    filename={fileToDisplay.projectName}
                    fileowner="Random"
                />
            )
            */
        return result;
    }

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
        !isLoading && (
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
                        {renderFileDisplays(maxFiles)}
                        {}
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
                    <LoaderButton
                        size="sm"
                        isLoading={isLoading}
                        onClick={addNextFileDisplays}
                    >
                        Get next projects
                    </LoaderButton>
                </div>
            </div>
        </div>
        )
    );
}
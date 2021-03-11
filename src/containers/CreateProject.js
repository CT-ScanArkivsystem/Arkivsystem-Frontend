import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./CreateUser.css";
import LoaderButton from "../components/LoaderButton";
import SideBar from "../components/SideBar";
import PostCreateProject from "../apiRequests/PostCreateProject";

export default function CreateProject() {
    const { userHasAuthenticated } = useAppContext();
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [creationDate, setCreationDate] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const history = useHistory();

    /**
     * Checks if projectName, creationDate and projectDescription form inputs have something put into them.
     * If no input in either of them the button will be disabled.
     * @returns {boolean}
     */
    function validateForm() {
        return (projectName.length > 0 && creationDate.length > 0 && projectDescription.length > 0);
    }

    /**
     * Sends a POST request to the server with the users input projectName, creationDate, isPrivate and projectDescription.
     * The server will attempt to create a project with these inputs.
     * @param event
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            let didProjectGetCreated = await PostCreateProject(projectName, isPrivate, creationDate, projectDescription); //PostCreateUser(firstName, lastName, email, password1, role);
            if (didProjectGetCreated !== null && didProjectGetCreated) {
                userHasAuthenticated(true);
                console.log("Project was created!")
                // TODO: Should send user to upload files tab.
                // TODO: Put project information into a projectStore.
                // history.push("/userFrontpage");
            } else {
                console.log("Project was not created!");
            }
        }
            catch (e) {
                setIsLoading(false);
                onError(e);
                //TODO: TELL THE USER SOMETHING WENT WRONG!
            }
        }
        // <p className="errorMessage">{displayFormError()}</p>
        // The formatting for the bootstrap Form can be found here: https://react-bootstrap.github.io/components/forms/
    return (
        <div className="CreateUser pageContainer">
            <SideBar>

            </SideBar>
            <Form onSubmit={handleSubmit}>
                <h2>Create a new user:</h2>
                <Form.Group size="lg" controlId="firstName">
                    <Form.Label>Project name</Form.Label>
                    <Form.Control
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="lastName">
                    <Form.Label>Creation date</Form.Label>
                    <Form.Control
                        type="text"
                        value={creationDate}
                        onChange={(e) => setCreationDate(e.target.value)}
                    />
                </Form.Group>
                <Form.Group size="lg">
                    <Form.Check
                        type="checkbox"
                        className="tagCheckbox"
                        label="Project is private"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                </Form.Group>
                <Form.Group size="lg" controlId="lastName">
                    <Form.Label>Project description</Form.Label>
                    <Form.Control
                        type="text"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                    />
                </Form.Group>

                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Create project
                </LoaderButton>
            </Form>
        </div>
    );
}
import React, {useState} from "react";
import "./CreateProjectContent.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "./LoaderButton";
import { onError } from "../libs/errorLib";
import { useHistory } from "react-router-dom";
import ProjectStore from "../stores/ProjectStore";
import UserStore from "../stores/UserStore";
import PostCreateProject from "../apiRequests/PostCreateProject";


export default function CreateProjectContent() {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [creationDate, setCreationDate] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const history = useHistory();


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
            let result = await PostCreateProject(projectName, isPrivate, creationDate, projectDescription); //PostCreateUser(firstName, lastName, email, password1, role);
            switch (result.status) {
                case 200:
                    let projectInformation = await result.json();
                    ProjectStore.projectId = projectInformation.projectId;
                    ProjectStore.projectName = projectName;
                    ProjectStore.projectDescription = projectDescription;
                    ProjectStore.isPrivate = isPrivate;
                    ProjectStore.creationDate = creationDate;
                    ProjectStore.projectOwner = UserStore.firstName + " " + UserStore.lastName;
                    history.push("/project");
                    break;
                case 403:
                    setErrorMessage("You have insufficient rights to create a project! Sending to the frontpage.");
                    setTimeout(() => {
                        history.push("/userFrontpage");
                    }, 5000);
                    break;
                case 404:
                    setErrorMessage("Create project failed. Error code 404!");
                    setIsLoading(false);
                    break;
                case 409:
                    setErrorMessage("Project with that name already exists!");
                    setIsLoading(false);
                    break;
                case 500:
                    setErrorMessage("An internal server error occurred! Error code 500!");
                    setIsLoading(false);
                    break;
                default:
                    setErrorMessage("An unexpected error occurred! Unexpected error code!");
                    setIsLoading(false);
                    break;
            }
        }
        catch (e) {
            setIsLoading(false);
            onError(e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
    }

    /**
     * Checks if projectName, creationDate and projectDescription form inputs have something put into them.
     * Also checks if the input values are too large for the server to be able to handle.
     * If no input in either of them the button will be disabled.
     * @returns {boolean}
     */
    function validateForm() {
        return (projectName.length > 0 && projectName.length < 256 && creationDate.length > 0 && projectDescription.length > 0 && projectDescription.length < 256);
    }

  return (
      <Form onSubmit={handleSubmit} className="createProjectForm">
          <div className="createProjectFormDiv">
          <h2>Create a new project:</h2>
          <div className="createProjectInputs">
              <div className="flex-column">
                  <Form.Group size="lg" controlId="projectName" className="createProjectInput">
                      <Form.Label>Project name</Form.Label>
                      <Form.Control
                          type="text"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group size="lg" controlId="creationDate" className="createProjectInput">
                      <Form.Label>Creation date</Form.Label>
                      <Form.Control
                          type="date"
                          value={creationDate}
                          onChange={(e) => setCreationDate(e.target.value)}
                      />
                  </Form.Group>
                  <Form.Group size="lg" className="createProjectInput">
                      <Form.Check
                          type="checkbox"
                          className="tagCheckbox"
                          label="Project is private"
                          checked={isPrivate}
                          onChange={(e) => setIsPrivate(e.target.checked)}
                      />
                  </Form.Group>
              </div>
                  <Form.Group size="lg" controlId="projectDescription" className="createProjectInput">
                      <Form.Label>Project description</Form.Label>
                      <Form.Control
                          as="textarea"
                          rows="9"
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                      />
                  </Form.Group>
          </div>
              <span className="errorMessage">{errorMessage}</span>
          </div>
          <div className="containerFooter">
              <LoaderButton
                  size="bg"
                  type="submit"
                  isLoading={isLoading}
                  disabled={!validateForm()}
              >
                  Create project
              </LoaderButton>
          </div>
      </Form>

  );
}

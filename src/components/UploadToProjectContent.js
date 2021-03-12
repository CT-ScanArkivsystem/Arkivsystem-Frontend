import React, {useState, useEffect} from "react";
import Form from "react-bootstrap/Form";
import "./CreateProjectContent.css";
import LoaderButton from "./LoaderButton";
import PostCreateProject from "../apiRequests/PostCreateProject";
import {onError} from "../libs/errorLib";
import {useAppContext} from "../libs/contextLib";
import ProjectStore from "../stores/ProjectStore";
import {Button} from "react-bootstrap";
import styled from "styled-components";
import {useDropzone} from "react-dropzone";

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
}

const Container = styled.div`
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      border-width: 2px;
      border-radius: 2px;
      border-color: ${props => getColor(props)};
      border-style: dashed;
      background-color: #fafafa;
      color: #bdbdbd;
      outline: none;
      transition: border .24s ease-in-out;
    `;

export default function UploadToProjectContent(props) {
    const { userHasAuthenticated } = useAppContext();
    const [uploadedFiles, setUploadedFiles] = useState([<p>Init value</p>]);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [creationDate, setCreationDate] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [filesInQueue, setFilesInQueue] = useState([]);
    //const [myDropzone, setMyDropzone] = useState(<MyDropzone files={this.props.files} changeFirst={this.props.setFiles} />);

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone();

        useEffect(() => {
            setFilesInQueue(acceptedFiles.map(file => (
                <li key={file.path}>
                    {file.path} - {file.size} bytes
                </li>
            )))
        }, [acceptedFiles]);

    /**
     * Sends a POST request to the server with the users input projectName, creationDate, isPrivate and projectDescription.
     * The server will attempt to create a project with these inputs.
     * @param event
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        event.preventDefault();
        console.log("creationDate: " + creationDate);
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

    /**
     * Checks if projectName, creationDate and projectDescription form inputs have something put into them.
     * Also checks if the input values are too large for the server to be able to handle.
     * If no input in either of them the button will be disabled.
     * @returns {boolean}
     */
    function validateFiles() {
        return (filesInQueue.length > 0);
    }

    function uploadFiles() {
        if (validateFiles()) {

        }
        setUploadedFiles(uploadedFiles.concat(<p>Test value</p>));
    }

    return (
      <Form onSubmit={handleSubmit} className="createProjectForm">
          <div className="createProjectFormDiv">
          <h2>Upload to project {ProjectStore.projectName}:</h2>
              <div className="container">
                  <Container {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
                      <input {...getInputProps()} />
                      <p>Drag 'n' drop some files here, or click to select files</p>
                  </Container>
                  <LoaderButton
                      isLoading={isLoading}
                      disabled={!validateFiles()}
                      onClick={uploadFiles}
                  >
                      Upload
                  </LoaderButton>
                  <aside>
                      <h2>Files in queue</h2>
                      <ul>{filesInQueue}</ul>
                  </aside>
              </div>
              <div>
                  <h2>Files uploaded</h2>
                  <div>
                      {uploadedFiles}
                  </div>
              </div>
          </div>
      </Form>
    );
}
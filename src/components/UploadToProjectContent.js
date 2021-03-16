import React, {useState, useEffect} from "react";
import Form from "react-bootstrap/Form";
import "./UploadToProjectContent.css";
import LoaderButton from "./LoaderButton";
import {onError} from "../libs/errorLib";
import ProjectStore from "../stores/ProjectStore";
import styled from "styled-components";
import {useDropzone} from "react-dropzone";
import PostUploadFiles from "../apiRequests/PostUploadFiles";
import FileDisplay from "./FileDisplay";

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

//TODO: If the upload fails, tell the user!
//TODO: Stop the user from uploading the same file! Maybe use the keys of the queued files?
export default function UploadToProjectContent() {
    const [isLoading, setIsLoading] = useState(false);

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [filesInQueue, setFilesInQueue] = useState([]);

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
                <FileDisplay
                    className="fileDisplay"
                    key={file.path}
                    filename={file.path}
                    fileowner=""
                />)))

            /*
            <li key={file.path}>
                    {file.path} - {file.size} bytes
                </li>
             */
        }, [acceptedFiles]);

    /**
     * Sends a POST request to the server with the users input projectName, creationDate, isPrivate and projectDescription.
     * The server will attempt to create a project with these inputs.
     * @param event
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        //TODO: If picture already exists you get response telling you what did not get saved. Tell user!
        // result is undefined, unable to use res to figure out what did not get uploaded
        event.preventDefault();
        setIsLoading(true);
            try {
                let didFilesGetUploaded = await PostUploadFiles(acceptedFiles, ProjectStore.projectId);
                if (didFilesGetUploaded && !didFilesGetUploaded.length) {
                    setUploadedFiles(uploadedFiles.concat(filesInQueue));
                    setFilesInQueue([]);
                    setIsLoading(false);
                    console.log("All files were uploaded successfully!")
                } else if (didFilesGetUploaded && didFilesGetUploaded.length) {
                    setIsLoading(false);
                    console.log("Something did not get uploaded: " + didFilesGetUploaded);
                }
                    else {
                    setIsLoading(false);
                    console.log("Files were not uploaded!");
                }
            } catch (e) {
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
                      className="uploadButton"
                      type="submit"
                      isLoading={isLoading}
                      disabled={!validateFiles()}
                      onClick={handleSubmit}
                  >
                      Upload
                  </LoaderButton>

              </div>
              <div>
                  <h2>Files to be uploaded</h2>
                  <div>{filesInQueue.length > 0 ? filesInQueue : "No files have been added to the queue yet."}</div>
              </div>
              <div>
                  <h2>Files uploaded</h2>
                  <div>
                      {uploadedFiles.length > 0 ? uploadedFiles : "No files have been uploaded."}
                  </div>
              </div>
          </div>
      </Form>
    );
}
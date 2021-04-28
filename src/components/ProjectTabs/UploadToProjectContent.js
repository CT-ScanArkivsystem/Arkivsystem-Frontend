import React, {useState, useEffect} from "react";
import Form from "react-bootstrap/Form";
import "./UploadToProjectContent.css";
import LoaderButton from "../LoaderButton";
import {onError} from "../../libs/errorLib";
import ProjectStore from "../../stores/ProjectStore";
import styled from "styled-components";
import {useDropzone} from "react-dropzone";
import PostUploadFiles from "../../apiRequests/PostUploadFiles";
import FileDisplay from "../filesAndProjects/FileDisplay";
import SubFolderDisplay from "../filesAndProjects/SubFolderDisplay";
import sanitize from "sanitize-filename";

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
export default function UploadToProjectContent(props) {
    const [isLoading, setIsLoading] = useState(false);

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [filesInQueue, setFilesInQueue] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [hasSelectedSubFolder, setHasSelectedSubFolder] = useState(false);
    const [selectedSubFolder, setSelectedSubFolder] = useState("");
    const [newFolderName, setNewFolderName] = useState("");

    const [projectSubFolders, setProjectSubFolders] = useState(props.projectSubFolders);

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
                    fileName={file.path}
                    fileOwner=""
                />)))
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
                let didFilesGetUploaded = await PostUploadFiles(acceptedFiles, ProjectStore.projectId, selectedSubFolder);
                if (didFilesGetUploaded && !didFilesGetUploaded.length) {

                    setUploadedFiles(filesInQueue);
                    setFilesInQueue([]);
                    setIsLoading(false);
                    setErrorMessage("");
                    //console.log("All files were uploaded successfully!")
                } else if (didFilesGetUploaded && didFilesGetUploaded.length) {
                    setIsLoading(false);
                    setErrorMessage(
                        <p className="errorMessage">Some files did not get uploaded!
                            <br/>
                            The most probable cause is that they already exist in the project! Files not uploaded:
                            <br/>
                            {filesNotUploadedToString(didFilesGetUploaded)}
                        </p>)
                    console.log("Something did not get uploaded: " + didFilesGetUploaded);
                }
                    else {
                    setIsLoading(false);
                    setErrorMessage(<p className="errorMessage">Something went wrong!</p>)
                    console.log("Files were not uploaded!");
                }
            } catch (e) {
                setIsLoading(false);
                onError(e);
                //TODO: TELL THE USER SOMETHING WENT WRONG!
            }
    }

    function filesNotUploadedToString(files) {
            let filesNotUploaded = "";

            for (let i = 0; i < files.length; i++) {
                if ((i+1) < files.length) {
                    filesNotUploaded = filesNotUploaded + files[i] + ", ";
                } else {
                    filesNotUploaded = filesNotUploaded + files[i];
                }
            }
            return filesNotUploaded;
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

    function renderSubFolders(subFolderList) {
        let result = [];

        if (subFolderList) {
            result = subFolderList.map((subFolder) => {
                return (
                    <SubFolderDisplay
                        isproject={false}
                        key={subFolder}
                        name={subFolder}
                        variant={selectedSubFolder === subFolder ? 'secondary' : 'outline-dark'}
                        onClick={() => {
                            if (selectedSubFolder === subFolder) {
                                setSelectedSubFolder("");
                                setHasSelectedSubFolder(false);
                            } else {
                                setSelectedSubFolder(subFolder);
                                setHasSelectedSubFolder(true);
                            }
                        }}
                    />
                )
            })
        }
        result.push(
            <form onSubmit={handleSubFolderSubmit} className="newFolderForm" key="addNewFolder">
                <div className="newFolderInputs">
                    <input
                        type="text"
                        className="newFolderTextInput"
                        placeholder="Add new folder"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <input
                        type="submit"
                        value="Create"
                        disabled={(newFolderName !== sanitize(newFolderName)) || newFolderName.includes(",")}
                        className="addNewFolderButton"
                    />
                </div>
                {(newFolderName !== sanitize(newFolderName) || newFolderName.includes(",")) ?
                    <span className="errorMessage">Your folder contains illegal characters!</span> : ""}
            </form>

        )
        return result;
    }

    function handleSubFolderSubmit(event) {
        event.preventDefault();
        let tempSubFolderArray = projectSubFolders;
        tempSubFolderArray.push(newFolderName);

        setProjectSubFolders(tempSubFolderArray);
        setNewFolderName("");
    }

    return (
        <div className="uploadFiles">
             <h2 className="uploadHeader">Upload to project</h2>
                  <div className="uploadContent">
                      <div className="projectSubFolderContainer">
                          <h4>Sub-folders</h4>
                          <div className="projectSubFolders">
                              {renderSubFolders(projectSubFolders)}
                          </div>
                      </div>
                      <div className="container">
                          <h4>Upload</h4>
                          <Form onSubmit={handleSubmit} className="uploadToProjectForm">
                              <Container className="dragAndDrop" {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
                                  <input {...getInputProps()} />
                                  <span>Drag 'n' drop some files here, or click to select files</span>
                              </Container>
                              <LoaderButton
                                  className="uploadButton"
                                  type="submit"
                                  isLoading={isLoading}
                                  disabled={!validateFiles() || !hasSelectedSubFolder}
                                  onClick={handleSubmit}
                              >
                                  Upload
                              </LoaderButton>
                          </Form>
                          <div className="width100">
                              <h2>Files to upload</h2>
                              {errorMessage}
                              <div>{filesInQueue.length > 0 ? filesInQueue : "No files have been added to the queue yet."}</div>
                          </div>
                          <div className="width100">
                              <h2>Files uploaded</h2>
                              <div>
                                  {uploadedFiles.length > 0 ? uploadedFiles : "No files have been uploaded yet."}
                              </div>
                          </div>
                      </div>
                  </div>
        </div>
    );
}

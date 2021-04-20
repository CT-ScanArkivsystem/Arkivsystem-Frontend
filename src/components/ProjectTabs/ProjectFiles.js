import React, {useState} from "react";
import "./ProjectFiles.css";
import SubFolderDisplay from "../filesAndProjects/SubFolderDisplay";
import GetAllFileNames from "../../apiRequests/GetAllFileNames";
import ProjectStore from "../../stores/ProjectStore";
import FileDisplay from "../filesAndProjects/FileDisplay";
import Button from "react-bootstrap/Button";
import LoaderButton from "../LoaderButton";
import PostDownloadFile from "../../apiRequests/PostDownloadFile";

export default function ProjectFiles(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [hasSelectedSubFolder, setHasSelectedSubFolder] = useState(false);
    const [selectedSubFolder, setSelectedSubFolder] = useState("");
    const [selectedDefaultFolder, setSelectedDefaultFolder] = useState("");
    const [filesInDirectory, setFilesInDirectory] = useState([]);
    const [filesToDownload, setFilesToDownload] = useState([]);

    const foldersInSubFolder = [
        "DICOM",
        "documents",
        "images",
        "logs",
        "tiff"
    ];
    const projectSubFolders = props.projectSubFolders;

    function renderSubFolders(subFolderList) {
        let result = [];

        if (subFolderList) {
            result = subFolderList.map((subFolder) => {
                return(
                    <SubFolderDisplay
                        className="fileDisplay"
                        key={subFolder}
                        name={subFolder.slice(0, -1)}
                        variant={selectedSubFolder === subFolder ? 'secondary' : 'outline-dark'}
                        hideChildren={selectedSubFolder !== subFolder}
                        showDropDownArrow={true}
                        onClick={() => {
                            if (selectedSubFolder === subFolder) {
                                setSelectedSubFolder("");
                                setSelectedDefaultFolder("");
                                setFilesToDownload([]);
                            } else {
                                setSelectedSubFolder(subFolder);
                                setSelectedDefaultFolder("");
                                setFilesToDownload([]);
                            }
                        }}
                        childFolders={foldersInSubFolder.map((defaultFolder) => {
                            return(
                                <SubFolderDisplay
                                    className="fileDisplay"
                                    key={defaultFolder}
                                    name={defaultFolder}
                                    isChildFolder={true}
                                    variant={selectedDefaultFolder === defaultFolder ? 'secondary' : 'outline-dark'}
                                    onClick={() => {
                                        if (selectedDefaultFolder === defaultFolder) {
                                            setSelectedDefaultFolder("");
                                            setFilesToDownload([]);
                                            setFilesInDirectory([])
                                        } else {
                                            setIsLoading(true);
                                            setFilesInDirectory([]);
                                            setSelectedDefaultFolder(defaultFolder);
                                            getFiles(defaultFolder, ProjectStore.projectId, selectedSubFolder);
                                            setFilesToDownload([]);
                                        }
                                    }}
                                />
                            )
                        })}
                    />
                )
            })
        }
        else {
            result = <span>Empty!</span>
        }
        return result;
    }

    async function getFiles(directory, projectId, subFolder) {
        let result = await GetAllFileNames(directory, projectId, subFolder);
        setFilesInDirectory(result);
        setIsLoading(false);
    }

    function renderFilesInFolder(fileList) {
        let result = [];

        if (fileList.length > 0) {
            result = fileList.map((file) => {
                return(
                    <FileDisplay
                        key={file.fileName}
                        fileName={file.fileName}
                        toggleFileInList={() => toggleFileInList(file)}
                        hasCheckbox={true}
                    />
                );
            })
        } else if (isLoading) {
            result = <span>Loading!</span>
        } else {
            result = <span>Empty!</span>
        }

        return result;
    }

    function toggleFileInList(file) {
        if (filesToDownload.indexOf(file.fileName) !== -1) {
            let tempArray = [...filesToDownload];
            let indexToRemove = tempArray.indexOf(file.fileName);
            tempArray.splice(indexToRemove, 1);
            setFilesToDownload(tempArray);
        }
        else {
            setFilesToDownload(filesToDownload.concat([file.fileName]));
        }
    }

    async function downloadFiles(files, projectId, subFolder) {
        setIsLoading(true);
        let result = await PostDownloadFile(files, projectId, subFolder);
        setIsLoading(false);
    }

  return (
      <div className="projectFiles">
          <div className="tabHeader">
              <h2>Project files</h2>
          </div>
          <div className="tabContent">
              <div className="projectFilesSubFolderContainer">
                  <h4>Sub-folders</h4>
                  <div className="projectSubFolders">
                      {renderSubFolders(projectSubFolders)}
                  </div>
              </div>
              <div className="projectFileContainer">
                  <LoaderButton
                      className="downloadButton"
                      size="sm"
                      variant="outline-dark"
                      isLoading={isLoading}
                      disabled={isLoading || !props.canDownloadFiles || filesToDownload.length < 1}
                      onClick={() => {
                          downloadFiles(filesToDownload, ProjectStore.projectId, selectedSubFolder.slice(0, -1));
                          //handleRemoveMember(ProjectStore.projectId, selectedMember.email)
                      }}
                  >
                      Download file{filesToDownload.length > 1 ? "s" : ""}
                  </LoaderButton>
                  {renderFilesInFolder(filesInDirectory)}
              </div>
          </div>
      </div>
  );
}

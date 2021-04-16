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
                            } else {
                                setSelectedSubFolder(subFolder);
                                setSelectedDefaultFolder("");
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
                                            } else {
                                                setIsLoading(true);
                                                setSelectedDefaultFolder(defaultFolder);
                                                getFiles(defaultFolder, ProjectStore.projectId, selectedSubFolder);

                                                setIsLoading(false)
                                            }
                                        }}
                                    />
                                )
                            })}
                    />
                )
            })
        }
        return result;
    }

    async function getFiles(directory, projectId, subFolder) {
        let result = await GetAllFileNames(directory, projectId, subFolder);
        console.log(result);
        setFilesInDirectory(result);
    }

    function renderFilesInFolder(fileList) {
        let result = ["Choose a directory"];

        console.log(fileList)

        if (fileList) {
            result = fileList.map((file) => {
                console.log(file)
                console.log(file.fileName)
                return(
                    <FileDisplay
                        key={file.fileName}
                        fileName={file.fileName}
                        toggleFileInList={() => toggleFileInList(file)}
                    />
                );
            })
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
        let result = await PostDownloadFile(files, projectId, subFolder);
        console.log(result);
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
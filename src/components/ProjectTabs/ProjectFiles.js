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

    /**
     * Creates a list of <SubFolderDisplay> which will be rendered on the site.
     * @param subFolderList the list which will be used to create the list that will be rendered.
     * @returns {[]} Array that contains <SubFolderDisplay>
     */
    function renderSubFolders(subFolderList) {
        let result = [];

        if (subFolderList) {
            result = subFolderList.map((subFolder) => {
                return(
                    <SubFolderDisplay
                        className="fileDisplay"
                        key={subFolder}
                        name={subFolder}
                        variant={selectedSubFolder === subFolder ? 'secondary' : 'outline-dark'}
                        hideChildren={selectedSubFolder !== subFolder}
                        showDropDownArrow={true}
                        onClick={() => {
                            if (selectedSubFolder === subFolder) {
                                setSelectedSubFolder("");
                                setSelectedDefaultFolder("");
                                setFilesToDownload([]);
                                setFilesInDirectory([]);
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
                                            setFilesInDirectory([]);
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

    /**
     * Creates a list of <FileDisplay> which will be rendered on the site.
     * @param fileList the list which will be used to create the list that will be rendered.
     * @returns {[]} Array that contains <FileDisplay>
     */
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

    /**
     * If the file provided is in the filesToDownload list it will remove it.
     * If the file is not in the list, it will be added.
     * @param file that is to be added or removed.
     */
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

    /**
     * Sets the site to loading then sends an API request to download the files
     * specified from the subFolder in the project specified.
     * @param files to be downloaded
     * @param projectId project that the subFolder is in
     * @param subFolder that the files are in
     * @returns {Promise<void>}
     */
    async function downloadFiles(files, projectId, subFolder) {
        setIsLoading(true);
        await PostDownloadFile(files, projectId, subFolder);
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
                  <h4>Files</h4>
                  <div className="flex-row">
                      <LoaderButton
                          className="downloadButton"
                          size="sm"
                          variant="outline-dark"
                          isLoading={isLoading}
                          disabled={isLoading || !props.canDownloadFiles || filesToDownload.length < 1}
                          onClick={() => {
                              downloadFiles(filesToDownload, ProjectStore.projectId, selectedSubFolder.slice(0, -1));
                          }}
                      >
                          Download file{filesToDownload.length > 1 ? "s" : ""}
                      </LoaderButton>
                      <LoaderButton
                          className="downloadButton"
                          size="sm"
                          variant="outline-dark"
                          isLoading={isLoading}
                          disabled={isLoading || !props.canDownloadFiles || filesInDirectory.length < 1}
                          onClick={() => {
                              let allFilesToDownload = [...filesInDirectory].map(file => {
                                  return(file.fileName)
                              });
                              downloadFiles(allFilesToDownload, ProjectStore.projectId, selectedSubFolder.slice(0, -1));
                          }}
                      >
                          Download all
                      </LoaderButton>
                  </div>
                  {renderFilesInFolder(filesInDirectory)}
              </div>
          </div>
      </div>
  );
}

import React, {useState} from "react";
import "./ProjectFiles.css";
import renderModeImage from "../../images/InfoQuestionMark1.png";
import SubFolderDisplay from "../filesAndProjects/SubFolderDisplay";
import GetAllFileNames from "../../apiRequests/GetAllFileNames";
import ProjectStore from "../../stores/ProjectStore";
import FileDisplay from "../filesAndProjects/FileDisplay";
import LoaderButton from "../LoaderButton";
import PostDownloadFile from "../../apiRequests/PostDownloadFile";
import ImageDisplay from "../filesAndProjects/ImageDisplay";
import Button from "react-bootstrap/Button";
import PostGetImage from "../../apiRequests/PostGetImage";

export default function ProjectFiles(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [renderImagesState, setRenderImagesState] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [imagesToRender, setImagesToRender] = useState([]);
    const [selectedSubFolder, setSelectedSubFolder] = useState("");
    const [selectedDefaultFolder, setSelectedDefaultFolder] = useState("");
    const [filesInDirectory, setFilesInDirectory] = useState([]);
    const [filesToDownload, setFilesToDownload] = useState([]);

    const imageWidth = 200; // In pixels

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

        if (subFolderList.length > 0) {
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
                                    onClick={async function() {
                                        if (selectedDefaultFolder === defaultFolder) {
                                            setSelectedDefaultFolder("");
                                            setFilesToDownload([]);
                                            setFilesInDirectory([]);
                                            setRenderImagesState(false);
                                        } else {
                                            setIsLoading(true);
                                            setFilesToDownload([]);
                                            setFilesInDirectory([]);
                                            setSelectedDefaultFolder(defaultFolder);
                                            if (defaultFolder === "images") {
                                                let imageNames = await getImageNamesInSubFolder(defaultFolder, ProjectStore.projectId, subFolder);
                                                await getImages(imageNames, ProjectStore.projectId, subFolder, true, 0);
                                            } else {
                                                await getFiles(defaultFolder, ProjectStore.projectId, selectedSubFolder);
                                            }
                                            setRenderImagesState(false);
                                        }
                                    }}
                                />
                            )
                        })}
                    />
                )
            })
        }
        else if (isLoading) {
            result = <span>Loading!</span>
        } else {
            result = <span>Empty!</span>
        }
        return result;
    }

    async function getFiles(directory, projectId, subFolder) {
        let result = await GetAllFileNames(directory, projectId, subFolder);
        setFilesInDirectory(result);
        setIsLoading(false);
    }

    async function getImageNamesInSubFolder(directory, projectId, subFolder) {
        let allImages = await GetAllFileNames(directory, projectId, subFolder);
        setFilesInDirectory(allImages);

        return allImages;
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
     * Creates a list of <ImageDisplay> which will be rendered on the site.
     * @param imagesList the list which will be used to create the list that will be rendered.
     * @returns {[]} Array that contains <ImageDisplay>
     */
    function renderImages(imagesList) {
        let result;

        if (imagesList.length > 0) {
            result = imagesList.map((image) => {
                return(
                    <ImageDisplay
                        className="imageDisplay"
                        key={image.imageSrc}
                        imageSrc={image.imageSrc}
                        imageName={image.imageName}
                        toggleFileInList={() => toggleFileInList(image)}
                    />
                )
            })
        }
        else {
            result = <span>Empty!</span>
        }
        return result;
    }

    /**
     * This function will get the next or previous page of images in the sub folder in the project specified.
     * @param imageNames Names of all the images in the sub folder.
     * @param projectId Decides which project it will look through.
     * @param subFolder Decides which sub folder in the project it will look through.
     * @param nextPage Decides whether to pull the next 6 images or the previous 6 images.
     * @param currentPageNumber The page the user is currently on.
     */
    async function getImages(imageNames, projectId, subFolder, nextPage, currentPageNumber) {
        setIsLoading(true);
        let result = [];

        if (imageNames.length > 0) {
            if (nextPage) {
                result = await getNextPageOfImages(projectId, subFolder, imageNames, currentPageNumber);
            } else if (!nextPage) {
                result = await getPreviousPageOfImages(projectId, subFolder, imageNames, currentPageNumber);
            }
        }

        setImagesToRender(result);
        setIsLoading(false);
    }

    /**
     * Will get the next 6 images and return them in an array.
     * @param projectId The ID for the project to get images from.
     * @param subFolder The sub folder to get images from.
     * @param imageNames Array with all the images in the sub folder.
     * @param currentPageNumber The page the user is currently on.
     * @returns {Promise<*[]>} An array of objects that holds the links to the pictures.
     */
    async function getNextPageOfImages(projectId, subFolder, imageNames, currentPageNumber) {
        let result = [];
        let i = currentPageNumber * 6;
        for (i; i < (currentPageNumber + 1) * 6 && i < imageNames.length; i++) {
            let currentImage = await PostGetImage(imageNames[i].fileName, projectId, subFolder, imageWidth);
            result.push(currentImage);
        }
        setCurrentPage(currentPageNumber + 1);
        return result;
    }

    /**
     * Will get the previous 6 images and return them in an array.
     * @param projectId The ID for the project to get images from.
     * @param subFolder The sub folder to get images from.
     * @param imageNames Array with all the images in the sub folder.
     * @param currentPageNumber The page the user is currently on.
     * @returns {Promise<*[]>} An array of objects that holds the links to the pictures.
     */
    async function getPreviousPageOfImages(projectId, subFolder, imageNames, currentPageNumber) {
        let result = [];
        let i = (currentPageNumber - 2) * 6;
        for (i; i < (currentPageNumber - 1) * 6 && i < imageNames.length; i++) {
            let currentImage = await PostGetImage(imageNames[i].fileName, projectId, subFolder, imageWidth);
            result.push(currentImage);
        }
        setCurrentPage(currentPageNumber - 1);
        return result;
    }

    function findTotalPages(allImages) {
        return Math.ceil(allImages.length / 6);
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
                      {selectedDefaultFolder === "images" ?
                          <img className={`${isLoading ? 'imageRenderModeButtonDisabled' : 'imageRenderModeButton'}`}
                               onClick={() => {
                                   if (!isLoading) {
                                       setRenderImagesState(!renderImagesState)
                                       setFilesToDownload([]);
                                   }
                               }}
                               src={renderModeImage}
                               alt="Toggle image rendering"
                          /> : <></>
                      }
                      <LoaderButton
                          className="downloadButton"
                          size="sm"
                          variant="outline-dark"
                          isLoading={isLoading}
                          disabled={isLoading || !props.canDownloadFiles || filesToDownload.length < 1}
                          onClick={async function() {
                              await downloadFiles(filesToDownload, ProjectStore.projectId, selectedSubFolder);
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
                          onClick={async function() {
                              let allFilesToDownload = [...filesInDirectory].map(file => {
                                  return(file.fileName)
                              });
                              await downloadFiles(allFilesToDownload, ProjectStore.projectId, selectedSubFolder);
                          }}
                      >
                          Download all
                      </LoaderButton>
                  </div>
                  {renderImagesState ?
                      <>
                          <div className="imagesContainer">
                              {renderImages(imagesToRender)}
                          </div>
                          <div className="containerFooter">
                              <Button
                                  className="downloadButton"
                                  size="sm"
                                  variant="dark"
                                  disabled={isLoading || imagesToRender.length < 1 || (currentPage * 6) > filesInDirectory.length}
                                  onClick={async function() {
                                      await getImages(filesInDirectory, ProjectStore.projectId, selectedSubFolder, true, currentPage)
                                  }}
                              >
                                  &gt;
                              </Button>
                              <div className="pageCounter">
                                  <span>Page {selectedSubFolder ? currentPage + " of " + findTotalPages(filesInDirectory) : "0"}</span>
                              </div>
                              <Button
                                  className="downloadButton"
                                  size="sm"
                                  variant="dark"
                                  disabled={isLoading || imagesToRender.length < 1 || currentPage === 1}
                                  onClick={async function() {
                                      await getImages(filesInDirectory, ProjectStore.projectId, selectedSubFolder, false, currentPage)
                                  }}
                              >
                                  &lt;
                              </Button>
                          </div>
                      </> :
                      renderFilesInFolder(filesInDirectory)}
              </div>
          </div>
      </div>
  );
}

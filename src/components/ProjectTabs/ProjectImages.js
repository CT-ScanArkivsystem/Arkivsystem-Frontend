import React, {useState} from "react";
import "./ProjectImages.css";
import ImageDisplay from "../filesAndProjects/ImageDisplay";
import PostGetImage from "../../apiRequests/PostGetImage";
import ProjectStore from "../../stores/ProjectStore";
import LoaderButton from "../LoaderButton";
import PostDownloadFile from "../../apiRequests/PostDownloadFile";
import SubFolderDisplay from "../filesAndProjects/SubFolderDisplay";
import GetAllFileNames from "../../apiRequests/GetAllFileNames";
import Button from "react-bootstrap/Button";

/**
 * JSX element which is a tab inside of a project. This element allows a user look at images inside of
 * a given sub folder.
 *
 * @param props
 * @returns {JSX.Element}
 */
export default function ProjectImages(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSubFolder, setSelectedSubFolder] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [filesToDownload, setFilesToDownload] = useState([]);
    const [imagesInSubFolder, setImagesInSubFolder] = useState([]);
    const [imagesToRender, setImagesToRender] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);

    const directoryWithImages = "images"; // The directory the server will find images in
    const imageWidth = 300; // In pixels
    const projectSubFolders = props.projectSubFolders; // All the sub folders in the project

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
                        isSelected={selectedImage === image}
                        onClick={() => {
                            if (selectedImage === image) {
                                setSelectedImage("");
                                setFilesToDownload([]);
                            } else {
                                setSelectedImage(image);
                                setFilesToDownload([image]);
                            }
                        }}
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
     * Creates a list of <SubFolderDisplay> which will be rendered on the site.
     * @param subFolderList the list which will be used to create the list that will be rendered.
     * @returns {[]} Array that contains <SubFolderDisplay>
     */
    function renderSubFolders(subFolderList) {
        let result;

        if (subFolderList.length > 0) {
            result = subFolderList.map((subFolder) => {
                return(
                    <SubFolderDisplay
                        key={subFolder}
                        name={subFolder}
                        variant={selectedSubFolder === subFolder ? 'secondary' : 'outline-dark'}
                        onClick={async function() {
                            setCurrentPage(0);
                            if (selectedSubFolder === subFolder) {
                                setSelectedSubFolder("");
                                setImagesToRender([]);
                            } else {
                                setIsLoading(true);
                                setSelectedSubFolder(subFolder);
                                let imageNames = await getImageNamesInSubFolder(directoryWithImages, ProjectStore.projectId, subFolder);
                                await getImages(imageNames, ProjectStore.projectId, subFolder, true, 0);
                            }
                        }}
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

    async function getImageNamesInSubFolder(directory, projectId, subFolder) {
        let allImages = await GetAllFileNames(directory, projectId, subFolder);
        setImagesInSubFolder(allImages);

        return allImages;
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
     * specified from the Images in the project specified.
     * @param files to be downloaded
     * @param projectId project that the Images is in
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
              <h2>Project images</h2>
          </div>
          <div className="tabContent">
              <div className="projectImagesSubFolderContainer">
                  <h4>Sub-folders</h4>
                  <div className="projectImages">
                      {renderSubFolders(projectSubFolders)}
                  </div>
              </div>
              <div className="projectImagesContainer">
                  <h4>{selectedSubFolder ? selectedSubFolder : "Images"}</h4>
                  <div className="flex-row">
                      <LoaderButton
                          className="downloadButton"
                          size="sm"
                          variant="outline-dark"
                          isLoading={isLoading}
                          disabled={isLoading || !props.canViewFiles || filesToDownload.length < 1}
                          onClick={async function() {
                              let allFilesToDownload = [...filesToDownload].map(file => {
                                  return(file.imageName)
                              });
                              await downloadFiles(allFilesToDownload, ProjectStore.projectId, selectedSubFolder.slice(0, -1));
                          }}
                      >
                          Download image{filesToDownload.length > 1 ? "s" : ""}
                      </LoaderButton>
                  </div>
                  <div className="imagesContainer">
                      {renderImages(imagesToRender)}
                  </div>
                  <div className="containerFooter">
                      <Button
                          className="downloadButton"
                          size="sm"
                          variant="dark"
                          disabled={isLoading || imagesToRender.length < 1 || (currentPage * 6) > imagesInSubFolder.length}
                          onClick={async function() {
                              await getImages(imagesInSubFolder, ProjectStore.projectId, selectedSubFolder, true, currentPage)
                          }}
                      >
                          &gt;
                      </Button>
                      <div className="pageCounter">
                          <span>Page {selectedSubFolder ? currentPage + " of " + findTotalPages(imagesInSubFolder) : "0"}</span>
                      </div>
                      <Button
                          className="downloadButton"
                          size="sm"
                          variant="dark"
                          disabled={isLoading || imagesToRender.length < 1 || currentPage === 1}
                          onClick={async function() {
                              await getImages(imagesInSubFolder, ProjectStore.projectId, selectedSubFolder, false, currentPage)
                          }}
                      >
                          &lt;
                      </Button>
                  </div>
              </div>
          </div>
      </div>
  );
}
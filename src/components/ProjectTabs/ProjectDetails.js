import React, {useState} from "react";
import ProjectStore from "../../stores/ProjectStore";
import "./ProjectDetails.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "../LoaderButton";
import TagDisplay from "../TagDisplay";
import PutAddTag from "../../apiRequests/PutAddTag";
import PutRemoveTag from "../../apiRequests/PutRemoveTag";
import PutSetProjectPrivacy from "../../apiRequests/PutSetProjectPrivacy";
import PutSetProjectDescription from "../../apiRequests/PutSetProjectDescription";
import {Table} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import PostCreateTag from "../../apiRequests/PostCreateTag";
import {useHistory} from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal";
import DeleteProject from "../../apiRequests/DeleteProject";
import GetAllTags from "../../apiRequests/GetAllTags";

export default function ProjectDetails(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [projectDescription, setProjectDescription] = useState(ProjectStore.projectDescription);
    const [editingDescription, setEditingDescription] = useState(false);
    const [editingTags, setEditingTags] = useState(false);
    const [isProjectPrivate, setIsProjectPrivate] = useState(ProjectStore.isPrivate);
    const [tagsToBeAdded, setTagsToBeAdded] = useState([]);
    const [tagsToBeRemoved, setTagsToBeRemoved] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [allTags, setAllTags] = useState([]);
    const [projectTags, setProjectTags] = useState([]);

    //Modal helper states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState(() => handleDeleteProject);

    const history = useHistory();

    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        initialisation();
    }, []);

    async function initialisation() {
        let tagsInProject = trimTagArray(ProjectStore.projectTags, ProjectStore.projectTags);
        // For some reason the array is not sorted, even though it should be provided with one.
        setProjectTags(tagsInProject.sort((a, b) => a.tagName > b.tagName ? 1 : -1));

        let allTagsTrimmed = trimTagArray(await GetAllTags(), ProjectStore.projectTags);
        setAllTags(allTagsTrimmed);
    }

    /**
     * Will check what tags in the provided list that contains the search keyword.
     *
     * @param tags Array that holds the tags that are to be searched through.
     * @param currentSearch String that holds the search keyword to use.
     * @returns {*[]} tagsToList Array that holds the tags that was searched for.
     */
    function searchForTags(tags, currentSearch) {
        let tagsToList = [];
        tags.forEach((tag) => {
            if (tag.tagName.toLowerCase().includes(currentSearch.toLowerCase())) {
                tagsToList.push(tag);
            }
        })
        return tagsToList;
    }

    /**
     * Will render the tags that are in the project and contains the search string as table rows.
     *
     * @param projectTags Array that holds the tags that are in the project.
     * @param currentSearch String that holds the tag the user searched for.
     * @returns result Array with table rows that holds the tags in the project or that the user searched for.
     */
    function renderTagsInProject(projectTags, currentSearch) {
        let result = [];
        let tagsToList;
        if (currentSearch && projectTags) {
            tagsToList = searchForTags(projectTags, currentSearch);
        } else {
            tagsToList = projectTags;
        }

        if (tagsToList) {
            result = tagsToList.map((tagToDisplay) => {
                return (
                    <tr className="tagNameDisplayRow" key={"TagName" + tagToDisplay.tagName}>
                        <td className="tagNameDisplay">{tagToDisplay.tagName}</td>
                    </tr>
                )
            })
        }
        return result;
    }

    /**
     * Will render the tags that exist and contains the search string as table rows.
     *
     * @param allTags Array that holds all of the tags that exist.
     * @param currentSearch String that holds the tag the user searched for.ch
     * @returns result Array with table rows that holds all the tags that exist and was searched for.
     */
    function renderAllTags(allTags, currentSearch) {
        let result = [];
        let tagsToList = [];
        if (currentSearch && allTags) {
            tagsToList = searchForTags(allTags, currentSearch)
        } else {
            tagsToList = allTags;
        }

        if (tagsToList) {
            result = tagsToList.map((tagToDisplay) => {
                return (
                    <tr className="tagNameDisplayRow" key={"TagKey" + tagToDisplay.tagName}>
                        <td className="tagNameDisplay">
                            <TagDisplay
                                id={"TagId" + tagToDisplay.tagName}
                                customCheckbox={true}
                                label={tagToDisplay.tagName}
                                value={tagToDisplay.tagName}
                                disabled={!editingTags}
                                defaultChecked={tagToDisplay.isInProject}
                                onChange={() => {
                                    tagToDisplay.isInProject = !tagToDisplay.isInProject;
                                    if (tagToDisplay.isInProject === true) {
                                        addTagsToArray(tagToDisplay);
                                    } else if (tagToDisplay.isInProject === false) {
                                        removeTagsFromArray(tagToDisplay);
                                    }
                                }}
                            />
                        </td>
                    </tr>
                )
            })
        }
        return result;
    }

    /**
     * This function removes the unnecessary numberOfProjects part of the tags that is gotten from the requests.
     * The function also calls to check if the tags are in the project and sets a variable that tells the site if it is in or not.
     *
     * @param arrayToTrim Array which contains tags and numberOfProjects the tags are in.
     * @param projectTagArray The array of the project to check if the tags are in both.
     * @returns *[] trimmedProjectTags The array with trimmed out numberOfProjects and has a new isInProject.
     */
    function trimTagArray(arrayToTrim, projectTagArray) {
        let trimmedProjectTags = [];
        if (arrayToTrim) {
            for (let i = 0; i < arrayToTrim.length; i++) {
                trimmedProjectTags.push({tagName: arrayToTrim[i].tagName, isInProject: checkIfTagIsInProject(arrayToTrim[i].tagName, projectTagArray)});
            }
        }
        return trimmedProjectTags;
    }

    /**
     * This function checks if a tag is in the project.
     *
     * @param tagToCheck The tag that should be checked if is in project.
     * @param projectTagArray The array that contains all the tags in the project.
     * @returns {boolean} isTagInProject returns true if the tag is in the project, else false.
     */
    function checkIfTagIsInProject(tagToCheck, projectTagArray) {
        let isTagInProject = false;
        if (projectTagArray && projectTagArray.length > 0) {
            for (let i = 0; i < projectTagArray.length && isTagInProject === false; i++) {
                if (tagToCheck === projectTagArray[i].tagName) {
                    isTagInProject = true;
                }
            }
        }
        return isTagInProject;
    }

    /**
     * Will add the given tag to the list that keeps track of what tags are going to be added to the project
     * @param tagToAdd to the project.
     */
    function addTagsToArray(tagToAdd) {
        if (tagsToBeRemoved.indexOf(tagToAdd.tagName) !== -1) {
            let tempArray = [...tagsToBeRemoved];
            let indexToRemove = tempArray.indexOf(tagToAdd.tagName);
            tempArray.splice(indexToRemove, 1);
            setTagsToBeRemoved(tempArray);
        } else {
            setTagsToBeAdded(tagsToBeAdded.concat([tagToAdd.tagName]));
        }
    }

    /**
     * Will remove the given tag from the list that keeps track of what tags are going to be removed from the project
     * @param tagToRemove from the project
     */
    function removeTagsFromArray(tagToRemove) {
        if (tagsToBeAdded.indexOf(tagToRemove.tagName) !== -1) {
            let tempArray = [...tagsToBeAdded];
            let indexToRemove = tempArray.indexOf(tagToRemove.tagName);
            tempArray.splice(indexToRemove, 1);
            setTagsToBeAdded(tempArray);
        } else {
            setTagsToBeRemoved(tagsToBeRemoved.concat([tagToRemove.tagName]));
        }
    }

    /**
     * Sends an api request on what tags to add to the project. Will also update the projectTag list.
     * @returns {Promise<void>}
     */
    async function addTagsToProject() {
        if (tagsToBeAdded.length > 0) {
            let result = await PutAddTag(ProjectStore.projectId, tagsToBeAdded);
            ProjectStore.projectTags = result.tags;
            setProjectTags(trimTagArray(result.tags, result.tags).sort((a, b) => a.tagName > b.tagName ? 1 : -1));
            setTagsToBeAdded([]);
        }
    }

    /**
     * Sends an api request on what tags to remove from the project. Will also update the projectTag list.
     * @returns {Promise<void>}
     */
    async function removeTagsFromProject() {
        if (tagsToBeRemoved.length > 0) {
            let result = await PutRemoveTag(ProjectStore.projectId, tagsToBeRemoved);
            ProjectStore.projectTags = result.tags;
            setProjectTags(trimTagArray(result.tags, result.tags).sort((a, b) => a.tagName > b.tagName ? 1 : -1));
            setTagsToBeRemoved([]);
        }
    }

    /**
     * Calls PostCreateTag API call to create a new tag from a given tag name.
     * @param tagToCreate name of the tag that is going to be created.
     * @returns {Promise<void>}
     */
    async function createNewTag(tagToCreate) {
        let result;
        if (tagToCreate) {
            setIsLoading(true);
            result = await PostCreateTag(tagToCreate);
            allTags.push(result);
            setIsLoading(false);
        }
    }

    /**
     * Toggles the privacy setting in a project.
     * @returns {Promise<void>}
     */
    async function setPrivacy() {
        setIsLoading(true);
        let wasSuccessful = await PutSetProjectPrivacy(ProjectStore.projectId, !isProjectPrivate);

        if (wasSuccessful) {
            ProjectStore.isPrivate = !isProjectPrivate;
            setIsProjectPrivate(!isProjectPrivate);
        } else {
            console.log("Something went wrong when attempting to change privacy settings!")
        }
        setIsLoading(false);
    }

    /**
     * Sends an api request to set the description to the given one.
     * @param newDescription to set as description.
     * @returns {Promise<void>}
     */
    async function setDescription(newDescription) {
        setIsLoading(true);
        let wasSuccessful = await PutSetProjectDescription(ProjectStore.projectId, newDescription);
        if (!wasSuccessful) {
            console.log("Something went wrong when updating description!");
        }
        setIsLoading(false);
    }

    /**
     * Opens the modal that lets the user delete the project.
     */
    function openDeleteModal() {
        setIsModalOpen(true);
        setModalText("Do you want to delete project " + ProjectStore.projectName + "? This action is irreversible!");
        setFunctionIfConfirmed(() => handleDeleteProject);
    }

    /**
     * Closes the modal.
     */
    function closeModal() {
        setIsModalOpen(false)
    }

    /**
     * Sends an api request to delete the current project.
     * @returns {Promise<void>}
     */
    async function handleDeleteProject() {
        setIsLoading(true);
        if (ProjectStore.projectId) {
            let result = await DeleteProject(ProjectStore.projectId);
            if (result.status === 200) {
                setErrorMessage("Project has been deleted.")
                setTimeout(() => {
                    closeModal();
                    history.push("/userFrontpage");
                }, 1500);
            } else {
                setErrorMessage("Something went wrong trying to delete project!")
                console.log("something went wrong");
            }
        }
    }

    return (
      <div className="projectDetails">
          <ConfirmationModal
              functionToCloseModal={closeModal}
              isOpen={isModalOpen}
              modalText={modalText}
              functionIfConfirmed={functionIfConfirmed}
          />
          <div className="tabHeader">
              <h2>{errorMessage ? <span className="errorMessage">{errorMessage}</span> : ProjectStore.projectName}</h2>
          </div>
          <div className="tabContent">
              <div className="tagsAndPrivateAndCreatedContainer">
                  <div className="creationDateContainer">
                      <span className="creationDate">Creation date: {ProjectStore.creationDate}</span>
                  </div>
                  <div className="isPrivateContainer">
                      <Form.Check
                          type="checkbox"
                          className="isPrivateCheckbox"
                          label="Is project private"
                          disabled={!props.canEdit || isLoading}
                          defaultChecked={ProjectStore.isPrivate}
                          onChange={async function() {
                              await setPrivacy();
                          }}
                      />
                  </div>
                  <h5>Tags</h5>
                  <div className="tagsContainer defaultBorder">
                      <div className="searchInputContainer">
                          <input
                              className="searchForTags"
                              type="search"
                              placeholder={editingTags ? 'Add tag' : 'Search'}
                              value={searchInput}
                              onChange={(e) => setSearchInput(e.target.value)}
                          />
                      </div>
                      <Table className="table-striped tagsTable">
                          <tbody>
                          {editingTags && renderAllTags(allTags, searchInput).length === 0 ?
                              <tr>
                                  <td>
                                      <Button
                                          className="createNewTagButton"
                                          variant="dark"
                                          onClick={async function() {
                                              await createNewTag(searchInput)
                                          }}
                                      >
                                          Create new tag
                                      </Button>
                                  </td>
                              </tr> : <></>
                          }
                          {editingTags ? renderAllTags(allTags, searchInput) : renderTagsInProject(projectTags, searchInput)}
                          </tbody>
                      </Table>
                      {props.canEdit ?
                          <LoaderButton
                              className="editButton"
                              size="sm"
                              type="submit"
                              isLoading={isLoading}
                              disabled={!props.canEdit}
                              onClick={async function() {
                                  if (editingTags) {
                                      setIsLoading(true);
                                      await addTagsToProject(tagsToBeAdded);
                                      await removeTagsFromProject(tagsToBeRemoved);
                                      setSearchInput("");
                                  }
                                  setIsLoading(false);
                                  setEditingTags(!editingTags);
                              }}
                          >
                              <span>{!editingTags ? 'Edit ' : 'Update '}</span>
                              tags
                          </LoaderButton> : ""
                      }
                  </div>
              </div>
              <div className="descriptionContainer">
                  <Form.Group size="lg" controlId="projectDescription" className="descriptionField">
                      <Form.Label className="descriptionLabel">Project description</Form.Label>
                      <Form.Control
                          as="textarea"
                          maxLength="255"
                          name="Project description"
                          rows="10"
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          readOnly={!editingDescription}
                      />
                  </Form.Group>
                  {props.canEdit ?
                      <LoaderButton
                          className="editButton"
                          size="sm"
                          type="submit"
                          isLoading={isLoading}
                          disabled={!props.canEdit}
                          onClick={async function() {
                              if (editingDescription) {
                                  setIsLoading(true);
                                  await setDescription(projectDescription)
                              }
                              setIsLoading(false);
                              setEditingDescription(!editingDescription);
                          }}
                      >
                          <span>{!editingDescription ? 'Edit ' : 'Update '}</span>
                          description
                      </LoaderButton> : ""
                  }
              </div>
          </div>
          {props.isOwner ? <div className="containerFooter">
              <LoaderButton
                  className="deleteProjectButton"
                  size="sm"
                  variant="outline-danger"
                  isLoading={isLoading}
                  disabled={isLoading || !props.isOwner}
                  onClick={() => openDeleteModal()}
              >
                  Delete project
              </LoaderButton>
          </div> : ""}
      </div>
    );
}

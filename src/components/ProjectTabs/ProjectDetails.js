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
    const [allTags, setAllTags] = useState(props.allTags);
    const [projectTags, setProjectTags] = useState(props.projectTags);

    //Modal helper states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState(() => handleDeleteProject);

    const history = useHistory();

    function renderTagsInProject(projectTags, currentSearch) {
        let result = [];
        let tagsToList = [];
        if (currentSearch && projectTags) {
            projectTags.forEach((tag) => {
                if (tag.tagName.toLowerCase().includes(currentSearch.toLowerCase())) {
                    tagsToList.push(tag);
                }
            })
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

    function renderAllTags(allTags, currentSearch) {
        let result = [];
        let tagsToList = [];
        if (currentSearch && allTags) {
            allTags.forEach((tag) => {
                if (tag.tagName.toLowerCase().includes(currentSearch.toLowerCase())) {
                    tagsToList.push(tag);
                }
            })
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

    function addTagsToArray(tagToDisplay) {
        if (tagsToBeRemoved.indexOf(tagToDisplay.tagName) !== -1) {
            let tempArray = [...tagsToBeRemoved];
            let indexToRemove = tempArray.indexOf(tagToDisplay.tagName);
            tempArray.splice(indexToRemove, 1);
            setTagsToBeRemoved(tempArray);
        } else {
            setTagsToBeAdded(tagsToBeAdded.concat([tagToDisplay.tagName]));
        }
    }

    function removeTagsFromArray(tagToDisplay) {
        if (tagsToBeAdded.indexOf(tagToDisplay.tagName) !== -1) {
            let tempArray = [...tagsToBeAdded];
            let indexToRemove = tempArray.indexOf(tagToDisplay.tagName);
            tempArray.splice(indexToRemove, 1);
            setTagsToBeAdded(tempArray);
        } else {
            setTagsToBeRemoved(tagsToBeRemoved.concat([tagToDisplay.tagName]));
        }
    }

    async function addTagsToProject() {
        if (tagsToBeAdded.length > 0) {
            let result = await PutAddTag(ProjectStore.projectId, tagsToBeAdded);
            if (result) {
                tagsToBeAdded.forEach((tag) => {
                    projectTags.push({tagName: tag, isInProject: true});
                })
            }
            setTagsToBeAdded([]);
        }
    }

    async function removeTagsFromProject() {
        if (tagsToBeRemoved.length > 0) {
            let result = await PutRemoveTag(ProjectStore.projectId, tagsToBeRemoved);
            if (result) {
                tagsToBeRemoved.forEach((tag) => {
                    projectTags.splice(projectTags.indexOf({tagName: tag, isInProject: true}), 1);
                })
            }
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
        let wasSuccessful = await PutSetProjectPrivacy(ProjectStore.projectId, !isProjectPrivate);

        if (wasSuccessful) {
            ProjectStore.isPrivate = !isProjectPrivate;
            setIsProjectPrivate(!isProjectPrivate);
        } else {
            console.log("Something went wrong when attempting to change privacy settings!")
        }
    }

    async function setDescription(newDescription) {
        setIsLoading(true);
        let wasSuccessful = await PutSetProjectDescription(ProjectStore.projectId, newDescription);
        if (!wasSuccessful) {
            console.log("Something went wrong when updating description!");
        }
        setIsLoading(false);
    }

    function openRemoveModal() {
        setIsModalOpen(true);
        setModalText("Do you want to delete project " + ProjectStore.projectName + "? This action is irreversible!");
        setFunctionIfConfirmed(() => handleDeleteProject);
    }

    function closeModal() {
        setIsModalOpen(false)
    }

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
                          disabled={!props.canEdit}
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
                  onClick={() => openRemoveModal()}
              >
                  Delete project
              </LoaderButton>
          </div> : ""}
      </div>
    );
}

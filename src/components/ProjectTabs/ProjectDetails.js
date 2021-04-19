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

export default function ProjectDetails(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [projectDescription, setProjectDescription] = useState(ProjectStore.projectDescription);
    const [editingDescription, setEditingDescription] = useState(false);
    const [editingTags, setEditingTags] = useState(false);
    const [isProjectPrivate, setIsProjectPrivate] = useState(ProjectStore.isPrivate);
    const [tagsToBeAdded, setTagsToBeAdded] = useState([]);
    const [tagsToBeRemoved, setTagsToBeRemoved] = useState([]);

    function renderProjectTags() {
        let result = [];

        if (props.projectTags !== []) {
            result = props.allTags.map(function(tagToDisplay) {
                return (
                    <TagDisplay
                        key={"TagKey" + tagToDisplay.tagName}
                        id={"TagId" + tagToDisplay.tagName}
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
            await PutAddTag(ProjectStore.projectId, tagsToBeAdded);
            setTagsToBeAdded([]);
        }
    }

    async function removeTagsFromProject() {
        if (tagsToBeRemoved.length > 0) {
            await PutRemoveTag(ProjectStore.projectId, tagsToBeRemoved);
            setTagsToBeRemoved([]);
        }
    }

    async function setPrivacy() {
        let wasSuccessful = false;
        if (isProjectPrivate) {
            wasSuccessful = await PutSetProjectPrivacy(ProjectStore.projectId, false);
        } else if (!isProjectPrivate) {
            wasSuccessful = await PutSetProjectPrivacy(ProjectStore.projectId, true);
        }

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


    return (
      <div className="projectDetails">
          <div className="tabHeader">
              <h2>{ProjectStore.projectName}</h2>
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
                          onChange={() => {
                              setPrivacy();
                          }}
                      />
                  </div>
                  <div className="tagsContainer defaultBorder">
                      {renderProjectTags()}
                      <LoaderButton
                          className="editButton"
                          size="sm"
                          type="submit"
                          isLoading={isLoading}
                          disabled={!props.canEdit}
                          onClick={() => {
                              if (editingTags) {
                                  setIsLoading(true);
                                  addTagsToProject(tagsToBeAdded);
                                  removeTagsFromProject(tagsToBeRemoved);
                              }
                              setIsLoading(false);
                              setEditingTags(!editingTags);
                          }}
                      >
                          <span>{!editingTags ? 'Edit ' : 'Update '}</span>
                          tags
                      </LoaderButton>
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
                  <LoaderButton
                      className="editButton"
                      size="sm"
                      type="submit"
                      isLoading={isLoading}
                      disabled={!props.canEdit}
                      onClick={() => {
                          if (editingDescription) {
                              setIsLoading(true);
                              setDescription(projectDescription)
                          }
                          setIsLoading(false);
                          setEditingDescription(!editingDescription);
                      }}
                  >
                      <span>{!editingDescription ? 'Edit ' : 'Update '}</span>
                      description
                  </LoaderButton>
              </div>
          </div>
      </div>
  );
}
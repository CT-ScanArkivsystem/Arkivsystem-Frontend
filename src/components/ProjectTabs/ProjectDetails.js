import React, {useState} from "react";
import ProjectStore from "../../stores/ProjectStore";
import "./ProjectDetails.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "../LoaderButton";
import TagDisplay from "../TagDisplay";
import GetProject from "../../apiRequests/GetProject";
import GetAllTags from "../../apiRequests/GetAllTags";
import PutAddTag from "../../apiRequests/PutAddTag";
import PutRemoveTag from "../../apiRequests/PutRemoveTag";
import PutSetProjectPrivacy from "../../apiRequests/PutSetProjectPrivacy";
import PutSetProjectDescription from "../../apiRequests/PutSetProjectDescription";
import UserStore from "../../stores/UserStore";

export default function ProjectDetails() {
    const [isLoading, setIsLoading] = useState(false);
    //TODO: When project is private and user is not a member/owner editing should be disabled!
    const [canUserEdit, setCanUserEdit] = useState(false);
    const [projectDescription, setProjectDescription] = useState(ProjectStore.projectDescription);
    const [editingDescription, setEditingDescription] = useState(false);
    const [editingTags, setEditingTags] = useState(false);
    const [isProjectPrivate, setIsProjectPrivate] = useState(ProjectStore.isPrivate);
    const [currentProject, setCurrentProject] = useState("");
    const [allTags, setAllTags] = useState([]);
    const [projectTags, setProjectTags] = useState([]);
    const [tagsToBeAdded, setTagsToBeAdded] = useState([]);
    const [tagsToBeRemoved, setTagsToBeRemoved] = useState([]);

    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        initialisation();
    }, []);

    async function initialisation() {
        let project = await GetProject(ProjectStore.projectId);
        setCurrentProject(project);

        let tagsVar = trimTagArray(project.tags, project.tags);
        setProjectTags(tagsVar);

        tagsVar = trimTagArray(await GetAllTags(), project.tags);
        setAllTags(tagsVar);

        //If any of these three are true, then the user is allowed to edit the page.
        if (checkIfOwner(ProjectStore.projectOwner, UserStore) || checkIfMember(ProjectStore.projectMembers, UserStore) || checkIfAdmin(UserStore)) {
            setCanUserEdit(true);
        }
    }

    function checkIfOwner() {
        return ProjectStore.projectOwner.userId === UserStore.userId;
    }

    function checkIfMember(memberList, user) {
        let isUserMember = false;
        for (let i = 0; memberList.length > i && isUserMember !== true; i++) {
            if (memberList[i].userId === user.userId) {
                isUserMember = true;
            }
        }
        return isUserMember;
    }

    function checkIfAdmin(user) {
        return user.role === "ROLE_ADMIN";
    }

    function trimTagArray(arrayToTrim, projectTagArray) {
        let trimmedProjectTags = [];
        if (arrayToTrim) {
            for (let i = 0; i < arrayToTrim.length; i++) {
                trimmedProjectTags.push({tagName: arrayToTrim[i].tagName, isInProject: checkIfTagIsInProject(arrayToTrim[i].tagName, projectTagArray)});
            }
        }
        return trimmedProjectTags;
    }

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

    function renderProjectTags() {
        let result = [];

        if (projectTags !== []) {
            result = allTags.map(function(tagToDisplay) {
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
            let result = await PutAddTag(ProjectStore.projectId, tagsToBeAdded);
            setTagsToBeAdded([]);
        }
    }

    async function removeTagsFromProject() {
        if (tagsToBeRemoved.length > 0) {
            let result = await PutRemoveTag(ProjectStore.projectId, tagsToBeRemoved);
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
                          disabled={!canUserEdit}
                          defaultChecked={ProjectStore.isPrivate}
                          onChange={(e) => {
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
                          disabled={!canUserEdit}
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
                          rows="10"
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          disabled={!editingDescription}
                      />
                  </Form.Group>
                  <LoaderButton
                      className="editButton"
                      size="sm"
                      type="submit"
                      isLoading={isLoading}
                      disabled={!canUserEdit}
                      onClick={() => {
                          if (editingDescription) {
                              setDescription(projectDescription)
                          }
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
import React, {useState} from "react";
import ProjectStore from "../../stores/ProjectStore";
import "./ProjectDetails.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "../LoaderButton";
import TagDisplay from "../TagDisplay";
import GetProject from "../../apiRequests/GetProject";
import GetAllTags from "../../apiRequests/GetAllTags";


export default function ProjectDetails() {
    const [isLoading, setIsLoading] = useState(false);
    const [canUserEdit, setCanUserEdit] = useState(true);
    //TODO: When project is private and user is not a member/owner editing should be disabled!
    const [projectDescription, setProjectDescription] = useState(ProjectStore.projectDescription);
    const [editingDescription, setEditingDescription] = useState(false);
    const [editingTags, setEditingTags] = useState(false);
    const [isProjectPrivate, setIsProjectPrivate] = useState(ProjectStore.isPrivate);
    const [currentProject, setCurrentProject] = useState("");
    const [allTags, setAllTags] = useState([]);
    const [projectTags, setProjectTags] = useState([]);

    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        initialisation();
    }, []);

    async function initialisation() {
        let project = await GetProject(ProjectStore.projectId);
        setCurrentProject(project);
        setProjectTags(project.tags);

        setAllTags(await GetAllTags());
    }

    //TODO: Checkboxes must be checked if they are in the project
    function renderProjectTags() {
        let result = [];

        if (projectTags !== []) {
            result = allTags.map(function(tagToDisplay) {
                return (
                    <TagDisplay
                        key={"TagName" + tagToDisplay.tagName}
                        id={"TagName" + tagToDisplay.tagName}
                        label={tagToDisplay.tagName}
                        index={tagToDisplay.numberOfProjects}
                        value={tagToDisplay.tagName}
                        disabled={!editingTags}
                    />
                )
            })
        }
        return result;
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
                          onChange={(e) => setIsProjectPrivate(e.target.value)}
                      />
                  </div>
                  <div className="tagsContainer defaultBorder">
                      {renderProjectTags()}
                      <LoaderButton
                          className="editDescriptionButton"
                          size="sm"
                          type="submit"
                          isLoading={isLoading}
                          disabled={!canUserEdit}
                          onClick={() => {
                              if (!editingTags) {
                                  //TODO: Send API request to update tags
                              }
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
                      className="editDescriptionButton"
                      size="sm"
                      type="submit"
                      isLoading={isLoading}
                      disabled={!canUserEdit}
                      onClick={() => {
                          if (!editingDescription) {
                              //TODO: Send API request to update description
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
import React, {useState} from "react";
import ProjectStore from "../../stores/ProjectStore";
import "./ProjectDetails.css";
import Form from "react-bootstrap/Form";

export default function ProjectDetails() {
    const [isLoading, setIsLoading] = useState(false);
    const [canUserEdit, setCanUserEdit] = useState(true);

    //TODO: When project is private and user is not a member/owner editing should be disabled!
  return (
      <div className="projectDetails">
          <div className="tabHeader">
              <h3>Project details</h3>
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
                          checked={ProjectStore.isPrivate}
                          value={ProjectStore.isPrivate}
                      />
                      {console.log(ProjectStore.isPrivate)}
                      isPrivateDiv
                  </div>
                  <div className="tagsContainer">
                      tagsDiv
                  </div>
              </div>
              <div className="descriptionContainer">
                  right
              </div>
          </div>
      </div>
  );
}
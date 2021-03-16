import React, { useState } from "react";
import {Button} from "react-bootstrap";

import "./CreateProject.css";
import SideBar from "../components/SideBar";
import CreateProjectContent from "../components/CreateProjectContent";
import UploadToProjectContent from "../components/UploadToProjectContent";
import ProjectStore from "../stores/ProjectStore";

export default function CreateProject() {

    const [pageContent, setPageContent] = useState(<CreateProjectContent contentToDetails={contentToDetails}/>);
    const [creatingProject, setCreatingProject] = useState(true);

    function contentToCreateProject() {
        setPageContent(<CreateProjectContent contentToDetails={contentToDetails}/>);
    }

    function contentToDetails() {
        setCreatingProject(false);
        setPageContent(<UploadToProjectContent />)

        ProjectStore.projectName = "testProject";
        ProjectStore.projectDescription = "test desc.";
        ProjectStore.isPrivate = false;
        ProjectStore.creationDate = "2021-03-15";
        ProjectStore.projectId = "adccb882-bc05-4502-816f-6f122eb10728";

    }


        // <p className="errorMessage">{displayFormError()}</p>
        // The formatting for the bootstrap Form can be found here: https://react-bootstrap.github.io/components/forms/
    return (
        <div className="CreateProject pageContainer">
            <SideBar>
                <h3>Options</h3>
                <Button
                    className="sideBarButton"
                    onClick={contentToCreateProject}
                    disabled={!creatingProject}
                >
                    Create new project
                </Button>
                <Button
                    className="sideBarButton"
                    onClick={contentToDetails}
                    disabled={creatingProject}
                >
                    View details
                </Button>
            </SideBar>
            <div className="pageContent">
                {pageContent}
            </div>

        </div>
    );
}
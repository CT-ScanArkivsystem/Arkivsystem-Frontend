import React, { useState } from "react";

import "./CreateProject.css";
import SideBar from "../components/SideBar";
import CreateProjectContent from "../components/CreateProjectContent";
import UploadToProjectContent from "../components/ProjectTabs/UploadToProjectContent";
import ProjectStore from "../stores/ProjectStore";
import LoaderButton from "../components/LoaderButton";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function CreateProject() {

    const [pageContent, setPageContent] = useState(<CreateProjectContent />);
    const [creatingProject, setCreatingProject] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    function contentToCreateProject() {
        // Need to pass contentToDetails to allow for a redirect when the project is created.
        setPageContent(<CreateProjectContent />);
    }

    return (
        <div className="CreateProject pageContainer">
            <SideBar>
                <h3>Options</h3>
                <Button
                    className="sideBarButton"
                    variant="dark"
                    onClick={contentToCreateProject}
                    disabled={!creatingProject}
                >
                    Create project
                </Button>
            </SideBar>
            <div className="pageContent">
                <CreateProjectContent />
            </div>
        </div>
    );
}

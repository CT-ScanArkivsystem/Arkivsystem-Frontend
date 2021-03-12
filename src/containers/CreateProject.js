import React, { useState } from "react";
import {Button} from "react-bootstrap";

import "./CreateProject.css";
import SideBar from "../components/SideBar";
import CreateProjectContent from "../components/CreateProjectContent";
import UploadToProjectContent from "../components/UploadToProjectContent";

export default function CreateProject() {

    const [pageContent, setPageContent] = useState(<CreateProjectContent />);

    function contentToCreateProject() {
        setPageContent(<CreateProjectContent />);
    }

    function contentToDetails() {
        setPageContent(<UploadToProjectContent />)
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
                >
                    Create new project
                </Button>
                <Button
                    className="sideBarButton"
                    onClick={contentToDetails}
                >
                    View details
                </Button>
                <Button className="sideBarButton">
                    Test3
                </Button>
            </SideBar>
            <div className="pageContent">
                {pageContent}
            </div>

        </div>
    );
}
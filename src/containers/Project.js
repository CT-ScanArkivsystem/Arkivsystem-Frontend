import React, {useState} from "react";
import "./Project.css";
import ProjectStore from "../stores/ProjectStore";
import SideBar from "../components/SideBar";
import LoaderButton from "../components/LoaderButton";
import {Link} from "react-router-dom";
import ProjectDetails from "../components/ProjectTabs/ProjectDetails";
import ProjectImages from "../components/ProjectTabs/ProjectImages";
import ProjectMembers from "../components/ProjectTabs/ProjectMembers";
import ProjectSpecialPermission from "../components/ProjectTabs/ProjectSpecialPermission";
import ProjectFiles from "../components/ProjectTabs/ProjectFiles";
import UploadToProjectContent from "../components/UploadToProjectContent";


function getProjectInformation() {
    console.log(ProjectStore.projectId);
    console.log(ProjectStore.projectName);
    console.log(ProjectStore.projectDescription);
    console.log(ProjectStore.projectOwner);
    console.log("isPrivate: " + ProjectStore.isPrivate);
    console.log(ProjectStore.creationDate);

    return <p>
        {ProjectStore.projectId}<br/>
        {ProjectStore.projectName}<br/>
        {ProjectStore.projectDescription}<br/>
        {ProjectStore.projectOwner}<br/>
        {ProjectStore.isPrivate}<br/>
        {ProjectStore.creationDate}
    </p>;
}

export default function Project() {

    const [pageContent, setPageContent] = useState(<ProjectDetails />);
    const [isLoading, setIsLoading] = useState(false);


    function contentToProjectDetails() {
        setPageContent(<ProjectDetails />);
    }

    function contentToUploadToProject() {
        setPageContent(<UploadToProjectContent />)
    }

    function contentToProjectImages() {
        setPageContent(<ProjectImages />)
    }

    function contentToProjectFiles() {
        setPageContent(<ProjectFiles />)
    }

    function contentToProjectMembers() {
        setPageContent(<ProjectMembers />)
    }

    function contentToProjectSpecialPermission() {
        setPageContent(<ProjectSpecialPermission />)
    }

    return (
        <div className="CreateProject pageContainer">
            <SideBar>
                <h3>Options</h3>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToProjectDetails}
                    isLoading={isLoading}
                >
                    Project details
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToUploadToProject}
                    isLoading={isLoading}
                >
                    Upload files
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToProjectImages}
                    isLoading={isLoading}
                >
                    Project Images
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToProjectFiles}
                    isLoading={isLoading}
                >
                    Project Files
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToProjectMembers}
                    isLoading={isLoading}
                >
                    Project Members
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToProjectSpecialPermission}
                    isLoading={isLoading}
                >
                    Special Permission
                </LoaderButton>
                <br/>
                <Link to="/project">
                    <LoaderButton
                        size="bg"
                        className="toProjectButton"
                        isLoading={isLoading}
                        onClick={() => setIsLoading(true)}
                    >
                        Go to project
                    </LoaderButton>
                </Link>
            </SideBar>
            <div className="pageContent">
                {pageContent}
            </div>
        </div>
    );
}
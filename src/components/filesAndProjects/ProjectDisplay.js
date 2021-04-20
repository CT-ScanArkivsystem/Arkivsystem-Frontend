import React, {useState} from "react";
import {Link} from "react-router-dom";
import "./ProjectDisplay.css";
import folderIcon from "../../images/Image-Folder-icon.png";
import ProjectStore from "../../stores/ProjectStore";

/**
 * ProjectDisplay is a component which simply displays a project as a clickable object.
 * When it is clicked it will store all the Project information in the ProjectStore.
 * @param props - contains information about the project the ProjectDisplay is displaying
 * @returns {JSX.Element}
 */
export default function ProjectDisplay ({...props}) {

    // This sets the default properties of the file. Also works as a guide to what needs to be input.
    ProjectDisplay.defaultProps = {
        projectId: "Default ID",
        projectName: "Default name",
        projectDescription: "Default description",
        projectOwner: "Default Owner",
        projectIsPrivate: true,
        projectCreationDate: "2021-04-14",
        projectMembers: [],
        usersWithSpecialPermission: []
    }

    function putProjectIntoStore() {
            ProjectStore.projectId = props.projectId;
            ProjectStore.projectName = props.projectName;
            ProjectStore.projectDescription = props.projectDescription;
            ProjectStore.projectOwner = props.projectOwner;
            ProjectStore.isPrivate = props.projectIsPrivate;
            ProjectStore.creationDate = props.projectCreationDate;
            ProjectStore.projectMembers = props.projectMembers;
            ProjectStore.usersWithSpecialPermission = props.usersWithSpecialPermission;
    }

    return (
        <Link onClick={putProjectIntoStore} to="/project" className="noUnderlineOnHover">
            <div className="projectDisplay customBorderAndText highlightOnHover noUnderLineOnHover">
                <img className="projectDisplayIcon" src={folderIcon} alt="Project icon" />
                <span className="projectDisplayName">{props.projectName}</span>
                <span className="projectDisplayOwner">{props.projectOwner.firstName + " " + props.projectOwner.lastName}</span>
            </div>
        </Link>
    );
}
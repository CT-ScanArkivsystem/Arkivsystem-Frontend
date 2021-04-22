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
    // Some of these are not needed anymore as they will be gotten when going to the project.
    ProjectDisplay.defaultProps = {
        projectId: "Default ID",
        projectName: "Default name",
        projectOwner: "Default Owner",
        projectOwnerName: undefined,
        projectIsPrivate: false
    }

    function setProjectIdToStore() {
        ProjectStore.projectId = props.projectId;
    }

    return (
        <Link onClick={setProjectIdToStore} to="/project" className="noUnderlineOnHover">
            <div className="projectDisplay customBorderAndText highlightOnHover noUnderLineOnHover">
                <img className="projectDisplayIcon" src={props.projectIsPrivate ? folderIcon : folderIcon} alt="Project icon" />
                <span className="projectDisplayName">{props.projectName}</span>
                <span className="projectDisplayOwner">
                    {props.projectOwnerName
                        ? props.projectOwnerName
                        : props.projectOwner.firstName + " " + props.projectOwner.lastName
                    }
                </span>
            </div>
        </Link>
    );
}
import React, {useState} from "react";
import {Link} from "react-router-dom";
import "./ProjectDisplay.css";
import projectIcon from "../../images/fileIcons/zip.svg";
import privateProjectIcon from "../../images/fileIcons/privateProject.svg";
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
        projectIsPrivate: false,
        projectResultInfo: ""
    }

    const resultInfoHashmap = new Map([
        ["name", "Name"],
        ["owner", "Owner"],
        ["description", "Description"],
        ["date", "Date"],
        ["member", "Member"],
        ["project_Tag", "Project tag"],
        ["file_tag", "File tag"],
    ])

    let infoToDisplay = "";

    function setProjectIdToStore() {
        ProjectStore.projectId = props.projectId;
    }

    function getResultInfo() {
        // Checks if the extension found is the same as the filename. If it is it's a folder.
        if (props.projectResultInfo) {
            if (resultInfoHashmap.has(props.projectResultInfo[0])) {
                infoToDisplay = resultInfoHashmap.get(props.projectResultInfo[0]);
            } else {
                infoToDisplay = "";
            }
        }
        return(infoToDisplay);
    }

    return (
        <Link onClick={setProjectIdToStore} to="/project" className="noUnderlineOnHover">
            <div className="projectDisplay customBorderAndText highlightOnHover noUnderLineOnHover">
                <img className="projectDisplayIcon" src={props.projectIsPrivate ? privateProjectIcon : projectIcon} alt="Project icon" />
                <span className="projectDisplayName">{props.projectName}</span>
                <span className="projectResultInfo">{getResultInfo()}</span>
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
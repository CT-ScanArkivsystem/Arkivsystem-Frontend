import React, {useState} from "react";
import "./FileDisplay.css";
import folderIcon from "../images/Image-Folder-icon.png";
import gifIcon from "../images/gif-icon.png";
import jpegIcon from "../images/jpeg-icon.png";
import pngIcon from "../images/Image-PNG-icon.png";
import tiffIcon from "../images/Image-TIFF-icon.png";
import {Link} from "react-router-dom";
import ProjectStore from "../stores/ProjectStore";

/**
 * FileDisplay is a component which simply displays a file as a clickable object.
 * @param props - contains information about the file the FileDisplay is displaying
 * @returns {JSX.Element}
 * @constructor
 */
export default function FileDisplay ({
    ...props
}) {

    let filetypeHashmap = new Map([
        ["folder", folderIcon],
        ["gif", gifIcon],
        // All JPEG formats
        ["JPG", jpegIcon],
        ["jpg", jpegIcon],
        ["JPEG", jpegIcon],
        ["jpeg", jpegIcon],
        ["jpe", jpegIcon],
        ["jif", jpegIcon],
        ["jfif", jpegIcon],
        ["jfi", jpegIcon],
        // All PNG formats
        ["png", pngIcon],
        ["PNG", pngIcon],
        // All TIFF formats
        ["tiff", tiffIcon],
        ["tif", tiffIcon],
    ])

    const [fileType, setFileType] = useState(checkFileType);

    let fileTypeIcon = "";

    function checkFileType() {
        return props.filename.substr(props.filename.lastIndexOf('.') + 1);
    }

    function getFileIcon() {
        // Checks if the extension found is the same as the filename. If it is it's a folder.
        if (fileType === props.filename) {
            fileTypeIcon = filetypeHashmap.get("folder");
        } else {
            fileTypeIcon = filetypeHashmap.get(fileType);
        }
        return(fileTypeIcon);
    }

    function putProjectIntoStore() {
        if (props.isproject) {
            ProjectStore.projectId = props.fileid;
            ProjectStore.projectName = props.filename;
            ProjectStore.projectDescription = props.filedescription;
            ProjectStore.projectOwner = props.fileowner;
            ProjectStore.isPrivate = props.fileisprivate;
            ProjectStore.creationDate = props.filecreationdate;
            ProjectStore.projectMembers = props.projectmembers;
            ProjectStore.usersWithSpecialPermission = props.userswithspecialpermission;
        }
    }

    return (
        <Link onClick={putProjectIntoStore} to="/project" className="fileDisplayLink">
            <div className={'fileDisplay'}>
                <img className="fileDisplayIcon" src={getFileIcon()} alt="Filetype icon" />
                <span className="fileDisplayName">{props.filename}</span>
                <span className="fileDisplayOwner">{props.fileowner.firstName + " " + props.fileowner.lastName}</span>
            </div>
        </Link>
    );
}
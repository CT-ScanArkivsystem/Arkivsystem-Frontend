import React from "react";
import "./SubFolderDisplay.css";
import folderIcon from "../../images/Image-Folder-icon.png";
import addNewFolderIcon from "../../images/catJam.gif";

/**
 * ProjectDisplay is a component which simply displays a subFolder as a clickable object.
 * When it is clicked it will store all the Project information in the ProjectStore.
 * @param props - contains information about the subFolder the ProjectDisplay is displaying
 * @returns {JSX.Element}
 */
export default function SubFolderDisplay ({...props}) {
    // This sets the default properties of the file.
    SubFolderDisplay.defaultProps = {
        addNew: false,
    }

    return (
        <div onClick={() => {props.onClick()}} className="subFolderDisplayLink">
            <div className="subFolderDisplay highlightOnHover">
                <img className="subFolderDisplayIcon" src={props.addNew ? addNewFolderIcon : folderIcon} alt="sub folder icon" />
                <span className="subFolderDisplayName">{props.name}</span>
            </div>
        </div>
    );
}
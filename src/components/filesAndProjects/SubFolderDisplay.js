import React, {useState} from "react";
import "./SubFolderDisplay.css";
import folderIcon from "../../images/Image-Folder-icon.png";
import addNewFolderIcon from "../../images/catJam.gif";
import Button from "react-bootstrap/Button";

/**
 * ProjectDisplay is a component which simply displays a subFolder as a clickable object.
 * When it is clicked it will store all the Project information in the ProjectStore.
 * @param props - contains information about the subFolder the ProjectDisplay is displaying
 * @returns {JSX.Element}
 */
export default function SubFolderDisplay ({...props}) {
    const [isNewFolder, setIsNewFolder] = useState(false);

    // This sets the default properties of the file.
    SubFolderDisplay.defaultProps = {
        addNew: false,
        highlighted: false,
        variant: 'outline-dark',
        isChildFolder: false
    }

    return (
        <div className="subFolderDisplayContainer">
            <Button
                variant={props.variant}
                onClick={props.onClick}
                size="sm"
                className={`${props.isChildFolder ? 'subFolderDisplayButtonChild' : 'subFolderDisplayButton'} customBorderAndText`}>
                <div className="subFolderDisplay">
                    <img className="subFolderDisplayIcon" src={folderIcon} alt="sub folder icon" />
                    <span className="subFolderDisplayName">{props.name}</span>
                </div>
            </Button>
            {props.childFolders}
        </div>
    );
}
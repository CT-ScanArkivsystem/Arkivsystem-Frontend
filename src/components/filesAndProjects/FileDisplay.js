import React, {useState} from "react";
import "./FileDisplay.css";
import folderIcon from "../../images/Image-Folder-icon.png";
import gifIcon from "../../images/gif-icon.png";
import jpegIcon from "../../images/jpeg-icon.png";
import pngIcon from "../../images/Image-PNG-icon.png";
import tiffIcon from "../../images/Image-TIFF-icon.png";
import Form from "react-bootstrap/Form";

/**
 * FileDisplay is a component which simply displays a file as a clickable object.
 * @param props - contains information about the file the FileDisplay is displaying
 * @returns {JSX.Element}
 * @constructor
 */
export default function FileDisplay ({...props}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);


    // This sets the default properties of the file.
    FileDisplay.defaultProps = {
        fileName: "Default name",
        hasCheckbox: false
    }

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

    const fileType = checkFileType(props.fileName);
    let fileTypeIcon = "";

    function checkFileType(fileName) {
        if (fileName) {
            return fileName.substr(fileName.lastIndexOf('.') + 1);
        }
        else {
            console.log("Error! FileDisplay name is probably empty!");
            return "";
        }
    }

    function getFileIcon() {
        // Checks if the extension found is the same as the filename. If it is it's a folder.
        if (fileType === props.fileName) {
            fileTypeIcon = filetypeHashmap.get("folder");
        } else {
            fileTypeIcon = filetypeHashmap.get(fileType);
        }
        return(fileTypeIcon);
    }

    return (
        <div className="fileDisplayContainer">
            <div className={'fileDisplay'}>
                <img className="fileDisplayIcon" src={getFileIcon()} alt="Filetype icon" />
                <span className="fileDisplayName">{props.fileName}</span>
                {props.hasCheckbox ?
                    <Form.Check
                        type="checkbox"
                        className="tagCheckbox"
                        onClick={() => {
                            setIsChecked(!isChecked);
                            props.toggleFileInList();
                        }}
                    /> : ''}

            </div>
        </div>
    );
}

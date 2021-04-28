import React, {useState} from "react";
import "./FileDisplay.css";
import unknownIcon from "../../images/fileIcons/unknown.svg";
import imageIcon from "../../images/fileIcons/image.svg";
import tiffIcon from "../../images/fileIcons/tiff.svg";
import wordIcon from "../../images/fileIcons/word.svg";
import excelIcon from "../../images/fileIcons/excel.svg";
import powerpointIcon from "../../images/fileIcons/powerpoint.svg";
import pdfIcon from "../../images/fileIcons/pdf.svg";
import txtIcon from "../../images/fileIcons/txt.svg";
import zipIcon from "../../images/fileIcons/zip.svg";
import soundIcon from "../../images/fileIcons/mp3.svg";
import videoIcon from "../../images/fileIcons/mp4.svg";
import dicomIcon from "../../images/fileIcons/ima.svg";

import Form from "react-bootstrap/Form";

/**
 * FileDisplay is a component which simply displays a file as a clickable object.
 * @param props - contains information about the file the FileDisplay is displaying
 * @returns {JSX.Element}
 * @constructor
 */
export default function FileDisplay ({...props}) {
    const [isChecked, setIsChecked] = useState(false);

    // This sets the default properties of the file.
    FileDisplay.defaultProps = {
        fileName: "Default name",
        hasCheckbox: false
    }

    const filetypeHashmap = new Map([
        ["unknown", unknownIcon],
        ["gif", imageIcon],
        // All JPEG formats
        ["JPG", imageIcon],
        ["jpg", imageIcon],
        ["jpeg", imageIcon],
        ["jpe", imageIcon],
        ["jif", imageIcon],
        ["jfif", imageIcon],
        ["jfi", imageIcon],
        // All PNG formats
        ["png", imageIcon],
        // All Word document formats
        ["docx", "doc", wordIcon],
        // All Excel formats
        ["xlsx", excelIcon],
        // All PowerPoint formats
        ["pptx", powerpointIcon],
        // All pdf formats
        ["pdf", pdfIcon],
        // All TIFF formats
        ["tiff", tiffIcon],
        ["tif", tiffIcon],
        // All txt formats
        ["txt", txtIcon],
        ["log", txtIcon],
        // Zip formats
        ["zip", zipIcon],
        // Sound formats
        ["mp3", soundIcon],
        ["wav", soundIcon],
        // Video formats
        ["mp4", videoIcon],
        ["mov", videoIcon],
        ["avi", videoIcon],
        ["wmv", videoIcon],
        // DICOM format
        ["ima", dicomIcon],
    ])

    const fileType = checkFileType(props.fileName);
    let fileTypeIcon = "";

    function checkFileType(fileName) {
        if (fileName) {
            return fileName.toLowerCase().substr(fileName.lastIndexOf('.') + 1);
        }
        else {
            console.log("Error! FileDisplay name is probably empty!");
            return "";
        }
    }

    function getFileIcon() {
        // Checks if the extension found is the same as the filename. If it is it's a folder.
        if (filetypeHashmap.has(fileType)) {
            fileTypeIcon = filetypeHashmap.get(fileType);
        } else {
            fileTypeIcon = filetypeHashmap.get("unknown");
        }
        return(fileTypeIcon);
    }

    return (
        <div className="fileDisplayContainer">
            <div className={'fileDisplay'}>
                <img className="fileDisplayIcon" src={getFileIcon()} alt="Filetype icon" />
                <span className="fileDisplayName">{props.fileName}</span>
                {props.hasCheckbox ?
                    <input
                        type="checkbox"
                        className="fileDisplayCheckbox"
                        onClick={() => {
                            setIsChecked(!isChecked);
                            props.toggleFileInList();
                        }}
                    /> : ''}
            </div>
        </div>
    );
}

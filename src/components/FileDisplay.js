import React from "react";
import "./FileDisplay.css";
import folderIcon from "../images/Image-Folder-icon.png";
import gifIcon from "../images/gif-icon.png";
import jpegIcon from "../images/jpeg-icon.png";
import pngIcon from "../images/Image-PNG-icon.png";
import tiffIcon from "../images/Image-TIFF-icon.png";
import {Link} from "react-router-dom";


export default function FileDisplay ({
    className = "",
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

    let fileTypeIcon = "";

    function checkFileType() {
        let fileExtension = props.filename.substr(props.filename.lastIndexOf('.') + 1);
        // Checks if the extension found is the same as the filename. If it is it's a folder.
        if (fileExtension === props.filename) {
            fileTypeIcon = filetypeHashmap.get("folder");
        } else {
            fileTypeIcon = filetypeHashmap.get(fileExtension);
        }
        return(fileTypeIcon);
    }

    /*
    function checkFileType() {
        fileTypeIcon = filetypeHashmap.get(props.filetype);
        return(fileTypeIcon);
    }
    */

    return (
        <Link to="/project" className="fileDisplayLink">
            <div className={'fileDisplay'}>
                <img className="fileDisplayIcon" src={checkFileType()} alt="Filetype icon" />
                <span className="fileDisplayName">{props.filename}</span>
                <span className="fileDisplayOwner">{props.fileowner}</span>
            </div>
        </Link>
    );
}
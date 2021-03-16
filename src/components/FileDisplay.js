import React from "react";
import "./FileDisplay.css";
import folderIcon from "../images/Image-Folder-icon.png";
import gifIcon from "../images/gif-icon.png";
import jpegIcon from "../images/jpeg-icon.png";
import pngIcon from "../images/Image-PNG-icon.png";
import tiffIcon from "../images/Image-TIFF-icon.png";


export default function FileDisplay ({
    className = "",
    ...props
}) {

    let filetypeHashmap = new Map([
        ["folder", folderIcon],
        ["gif", gifIcon],
        // All JPEG formats
        ["jpg", jpegIcon],
        ["jpeg", jpegIcon],
        ["jpe", jpegIcon],
        ["jif", jpegIcon],
        ["jfif", jpegIcon],
        ["jfi", jpegIcon],
        ["png", pngIcon],
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
      <div className={'fileDisplay'} {...props}>
          <img className="fileDisplayIcon" src={checkFileType()} alt="Filetype icon" />
          <span className="fileDisplayName">{props.filename}</span>
          <span className="fileDisplayOwner">{props.fileowner}</span>
      </div>
    );
}
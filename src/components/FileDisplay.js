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
        ["jpeg", jpegIcon],
        ["png", pngIcon],
        ["tiff", tiffIcon],
    ])

    let fileTypeIcon = "";

    function checkFileType() {
        fileTypeIcon = filetypeHashmap.get(props.filetype);
        return(fileTypeIcon)
    }

    return (
      <div className={'fileDisplay'} {...props}>
          <img className="fileDisplayIcon" src={checkFileType()} alt="Filetype icon" />
          <span className="fileDisplayName">{props.filename}</span>
          <span className="fileDisplayOwner">{props.fileowner}</span>
      </div>
    );
}
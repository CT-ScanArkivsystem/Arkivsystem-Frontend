import React, {useState} from "react";
import "./File.css";
import folderIcon from "../images/Image-Folder-icon.png";
import gifIcon from "../images/gif-icon.png";
import jpegIcon from "../images/jpeg-icon.png";
import pngIcon from "../images/Image-PNG-icon.png";
import tiffIcon from "../images/Image-TIFF-icon.png";


export default function Project ({
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
    // TODO: Need to give this component the parameters of the project
    // This includes: Project name and project owner.
    // Put project name further left so it is next to the icon
  return (
      <div className={'file'} {...props}>
          <img className="fileIcon" src={checkFileType()} alt="Filetype icon" />
          <span className="fileName">{props.projectname}</span>
          <span className="fileOwner">{props.projectowner}</span>
      </div>
  );
}
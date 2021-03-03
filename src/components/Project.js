import React, {useState} from "react";
import "./Project.css";
import folderIcon from "../images/catJam.gif";

export default function Project ({
    className = "",
    ...props
}) {
    const [projectName, setProjectName] = useState("");
    // TODO: Need to give this component the parameters of the project
    // This includes: Project name and project owner.
    // Put project name further left so it is next to the icon
  return (
      <div className={'project'} {...props}>
          <img className="projectIcon" src={folderIcon} alt="Project filetype icon" />
          <span className="projectName">Test project</span>
          <span className="projectOwner">Aleksander Bakken</span>
      </div>
  );
}
import React, {useState} from "react";
import "./ProjectFiles.css";

export default function ProjectFiles() {
    const [isLoading, setIsLoading] = useState(false);

  return (
      <div className="projectFiles">
          <div className="tabHeader">
              <h2>Project files</h2>
          </div>
          <div className="tabContent">
              <div className="projectSubfolderContainer">
                  <h5>Sub-folders</h5>
                  <div className="projectSubfolders">
                      this will contain the folders
                  </div>
              </div>
              <div className="projectFileContainer">
                  This will contain the files
              </div>
          </div>
      </div>
  );
}
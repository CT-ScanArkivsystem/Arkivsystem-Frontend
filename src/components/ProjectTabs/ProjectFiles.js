import React, {useState} from "react";
import "./ProjectFiles.css";
import SubFolderDisplay from "../filesAndProjects/SubFolderDisplay";

export default function ProjectFiles(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [hasSelectedSubFolder, setHasSelectedSubFolder] = useState(false);
    const [selectedSubFolder, setSelectedSubFolder] = useState("");
    const projectSubFolders = props.projectSubFolders;

    function renderSubFolders(subFolderList) {
        let result = [];

        if (subFolderList) {
            result = subFolderList.map((subFolder) => {
                return(
                    <SubFolderDisplay
                        className="fileDisplay"
                        isproject={false}
                        key={subFolder}
                        name={subFolder.slice(0, -1)}
                        variant={selectedSubFolder === subFolder ? 'secondary' : 'outline-dark'}
                        onClick={() => {
                            if (selectedSubFolder === subFolder) {
                                setSelectedSubFolder("");
                            } else {
                                setSelectedSubFolder(subFolder);
                            }
                            setHasSelectedSubFolder(!hasSelectedSubFolder);
                        }}
                    />
                )
            })
        }
        return result;
    }

  return (
      <div className="projectFiles">
          <div className="tabHeader">
              <h2>Project files</h2>
          </div>
          <div className="tabContent">
              <div className="projectSubfolderContainer">
                  <h5>Sub-folders</h5>
                  <div className="projectSubfolders">
                      {renderSubFolders(projectSubFolders)}
                  </div>
              </div>
              <div className="projectFileContainer">
                  This will contain the files
              </div>
          </div>
      </div>
  );
}
import React, {useState} from "react";
import "./ProjectFiles.css";
import SubFolderDisplay from "../filesAndProjects/SubFolderDisplay";

export default function ProjectFiles(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [hasSelectedSubFolder, setHasSelectedSubFolder] = useState(false);
    const [selectedSubFolder, setSelectedSubFolder] = useState("");
    const [selectedDefaultFolder, setSelectedDefaultFolder] = useState("");
    const foldersInSubFolder = [
        "DICOM",
        "documents",
        "images",
        "logs",
        "tiff"
    ];
    const projectSubFolders = props.projectSubFolders;

    function renderSubFolders(subFolderList) {
        let result = [];

        if (subFolderList) {
            result = subFolderList.map((subFolder) => {
                return(
                    <SubFolderDisplay
                        className="fileDisplay"
                        key={subFolder}
                        name={subFolder.slice(0, -1)}
                        variant={selectedSubFolder === subFolder ? 'secondary' : 'outline-dark'}
                        hideChildren={selectedSubFolder !== subFolder}
                        showDropDownArrow={true}
                        onClick={() => {
                            if (selectedSubFolder === subFolder) {
                                setSelectedSubFolder("");
                                setSelectedDefaultFolder("")
                            } else {
                                setSelectedSubFolder(subFolder);
                            }
                        }}
                        childFolders={foldersInSubFolder.map((defaultFolder) => {
                                return(
                                    <SubFolderDisplay
                                        className="fileDisplay"
                                        key={defaultFolder}
                                        name={defaultFolder}
                                        isChildFolder={true}
                                        variant={selectedDefaultFolder === defaultFolder ? 'secondary' : 'outline-dark'}
                                        onClick={() => {
                                            if (selectedDefaultFolder === defaultFolder) {
                                                setSelectedDefaultFolder("");
                                            } else {
                                                setSelectedDefaultFolder(defaultFolder);
                                            }
                                        }}
                                    />
                                )
                            })}
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
              <div className="projectFilesSubFolderContainer">
                  <h5>Sub-folders</h5>
                  <div className="projectSubFolders">
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
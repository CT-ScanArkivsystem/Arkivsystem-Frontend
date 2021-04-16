import React, {useState} from "react";
import "./SubFolderDisplay.css";
import folderIcon from "../../images/Image-Folder-icon.png";
import dropDownIcon from "../../images/dropdown-arrow.png";
import Button from "react-bootstrap/Button";
import styled from "styled-components";

// A component that represents the arrow for dropdown
const DropDownArrow = styled.div `
    background: url(${dropDownIcon}) no-repeat;
    background-size: cover;
    height: 15px;
    width: 15px;
    image-rendering: crisp-edges;
    `;


/**
 * ProjectDisplay is a component which simply displays a subFolder as a clickable object.
 * When it is clicked it will store all the Project information in the ProjectStore.
 * @param props - contains information about the subFolder the ProjectDisplay is displaying
 * @returns {JSX.Element}
 */
export default function SubFolderDisplay ({...props}) {
    // This sets the default properties of the file.
    SubFolderDisplay.defaultProps = {
        addNew: false,
        highlighted: false,
        variant: 'outline-dark',
        hideChildren: true,
        isChildFolder: false,
        showDropDownArrow: false
    }

    return (
        <div className="subFolderDisplayContainer">
            <Button
                variant={props.variant}
                onClick={props.onClick}
                size="sm"
                className={`
                    ${props.isChildFolder ? 'subFolderDisplayButtonChild' : 'subFolderDisplayButton'} 
                    noHighlight 
                    customBorderAndText`
                }
            >
                <div className="subFolderDisplay">
                    <img className="subFolderDisplayIcon" src={folderIcon} alt="sub folder icon" />
                    <span className="subFolderDisplayName">{props.name}</span>
                    {props.showDropDownArrow ? <DropDownArrow /> : ''}
                </div>
            </Button>
            {props.hideChildren ? '' : props.childFolders}
        </div>
    );
}
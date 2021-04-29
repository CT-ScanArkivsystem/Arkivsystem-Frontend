import React from "react";
import "./ImageDisplay.css";
import unknownIcon from "../../images/fileIcons/unknown.svg";

/**
 * FileDisplay is a component which simply displays a file as a clickable object.
 * @param props - contains information about the file the FileDisplay is displaying
 * @returns {JSX.Element}
 * @constructor
 */
export default function ImageDisplay ({...props}) {

    // This sets the default properties of the file.
    ImageDisplay.defaultProps = {
        imageSrc: unknownIcon,
        imageName: "noNameGiven",
        isSelected: false
    }

    return (
        <div className="imageDisplayContainer">
            <img className={`${props.isSelected ? 'imageSelected' : 'imageNotSelected'} imageDisplay`}
                 onClick={props.onClick}
                 src={props.imageSrc}
                 alt={props.imageName} />
        </div>
    );
}

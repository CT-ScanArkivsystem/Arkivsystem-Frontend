import React from "react";
import "./MemberDisplay.css";
import Button from "react-bootstrap/Button";

/**
 * MemberDisplay is a component which simply displays a member as a clickable object.
 * @param props - contains information about the member the MemberDisplay is displaying
 * @returns {JSX.Element}
 * @constructor
 */
export default function MemberDisplay ({...props}) {
    return (
        <Button
            variant={props.variant}
            onClick={props.onClick}
            size="sm"
            className="memberDisplayLink noHighlight">
            <div className="memberDisplay">
                <span className="memberDisplayName">{props.memberfirstname + " " + props.memberlastname}</span>
                <span className="memberDisplayEmail">{props.memberemail}</span>
            </div>
        </Button>
    );
}
import React from "react";
import "./InformationBubble.css";

export default function InformationBubble(props) {
    // This sets the default properties of the file.
    InformationBubble.defaultProps = {
        tipHeader: "No header set",
        tipParagraph: "No paragraph set",
        textToHoverOver: "?"
    }

    return (
        <div className={`informationBubble`}>
            <div className="informationToShow">
                <h4>{props.tipHeader}</h4>
                <p>{props.tipParagraph}</p>
            </div>
        </div>
    );
}

import React, {useState} from "react";
import {useHistory} from "react-router-dom";

export default function DeleteTags() {
    //Something

    return (
        <React.Fragment>
            <h4>You can delete tags here!</h4>
            <span>{"History location: " + useHistory().location.pathname}</span>
        </React.Fragment>
    )
}

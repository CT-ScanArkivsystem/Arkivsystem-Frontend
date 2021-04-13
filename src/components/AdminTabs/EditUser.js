import React from "react";

export default function EditUser({...props}) {

    return (
        <React.Fragment>
            <h3>EditUser</h3>
            console.log("Editing user: " + props.UserToEdit.email)
        </React.Fragment>
    )

}
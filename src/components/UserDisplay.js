import React from "react";
import "./AdminTabs/FindUser.css";
import ProjectStore from "../stores/ProjectStore";
import UserEditStore from "../stores/UserEditStore";
import {Link} from "react-router-dom";
import "./UserDisplay.css";

export default function UserDisplay({...props}) {

    let handleRowClick = () => {
        console.log("Saving user (" + props.email + ") to UserStore")
        UserEditStore.userId = props.userId
        UserEditStore.email = props.email
        UserEditStore.firstName = props.firstName
        UserEditStore.lastName = props.lastName
        UserEditStore.role = props.role.replace("ROLE_", "").toLowerCase()

        props.onSomeClick()
    }

    return (
            <tr onClick={() => handleRowClick()} className="user-display">
                <td className="user-display-field">{props.firstName} {props.lastName}</td>
                <td className="user-display-field">{props.email}</td>
                <td className="capitalize user-display-field">{props.role.replace("ROLE_", "").toLowerCase()}</td>
            </tr>
    )
}
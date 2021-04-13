import React from "react";
import "./AdminTabs/FindUser.css";
import ProjectStore from "../stores/ProjectStore";
import UserStore from "../stores/UserStore";
import {Link} from "react-router-dom";
import "./UserDisplay.css";

export default function UserDisplay({...props}) {

    function putUserIntoStore() {
        console.log("Saving user (" + props.email + ") details to UserStore")
        UserStore.userId = props.userId
        UserStore.email = props.email
        UserStore.firstName = props.firstName
        UserStore.lastName = props.lastName
    }

    return (
            <tr onClick={putUserIntoStore} className="user-display">
                <td className="user-display-field">{props.firstName} {props.lastName}</td>
                <td className="user-display-field">{props.email}</td>
                <td className="capitalize user-display-field">{props.roles.replace("ROLE_", "").toLowerCase()}</td>
            </tr>
    )
}
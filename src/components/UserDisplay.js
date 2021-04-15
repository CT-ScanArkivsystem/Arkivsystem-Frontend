import React from "react";
import "./AdminTabs/FindUser.css";
import ProjectStore from "../stores/ProjectStore";
import UserEditStore from "../stores/UserEditStore";
import {Link} from "react-router-dom";
import "./UserDisplay.css";
import PutEditUser from "../apiRequests/PutEditUser";
import {onError} from "../libs/errorLib";
import DeleteDeleteUser from "../apiRequests/DeleteDeleteUser";

export default function UserDisplay({...props}) {

    let handleRowClick = () => {
        console.log("Saving user (" + props.email + ") to UserStore")
        UserEditStore.userId = props.userId
        UserEditStore.email = props.email
        UserEditStore.firstName = props.firstName
        UserEditStore.lastName = props.lastName
        UserEditStore.role = props.role.replace("ROLE_", "").toLowerCase()

        props.EditPageEvent1()
    }

    async function handleDeleteUser() {
        console.log("USER " + props.firstName + " " + props.lastName + " HAS BEEN DELETED!")
        try {
            let wasUserDeleted = await DeleteDeleteUser(props.userId)
            if (wasUserDeleted !== null) {
                console.log("User has been deleted!");
            } else {
                console.log("User was not deleted!");
            }
        } catch (e) {
            onError(e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
    }

    switch (props.pageType3) {
        case "deleteUser":
            return (
                <tr onClick={() => handleDeleteUser()} className="user-display">
                    <td className="user-display-field">{props.firstName} {props.lastName}</td>
                    <td className="user-display-field">{props.email}</td>
                    <td className="capitalize user-display-field">{props.role.replace("ROLE_", "").toLowerCase()}</td>
                </tr>
            );
        case "editUser":
            return (
                <tr onClick={() => handleRowClick()} className="user-display">
                    <td className="user-display-field">{props.firstName} {props.lastName}</td>
                    <td className="user-display-field">{props.email}</td>
                    <td className="capitalize user-display-field">{props.role.replace("ROLE_", "").toLowerCase()}</td>
                </tr>
            );
    }

}
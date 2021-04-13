import React from "react";
import "./AdminTabs/EditUser.css";

export default function UserDisplay({...props}) {

    return (
        <tr>
            <td>{props.firstName} {props.lastName}</td>
            <td>{props.email}</td>
            <td className="capitalize">{props.roles.replace("ROLE_", "").toLowerCase()}</td>
        </tr>
    )
}
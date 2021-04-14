import React, {Fragment} from "react";
import UserDisplay from "../UserDisplay";

export default function UserResultRows({...props}) {
    const filtered = props.filteredPersons.map(user => {

        return (
            <UserDisplay
                className="userDisplay"
                key={user.userId}
                email={user.email}
                firstName={user.firstName}
                lastName={user.lastName}
                roles={user.roles[0].roleName}
                onSomeClick={() => {props.onSomethingHappens()}}
            />
        )
    })

    return (
        <React.Fragment>
            {filtered}
        </React.Fragment>
    )
}
import React, {Fragment} from "react";
import UserDisplay from "../UserDisplay";

export default function UserResultRows({...props}) {
    const filtered = props.filteredPersons.map(user => {

        return (
            <UserDisplay
                className="userDisplay"
                key={user.userId}
                userId={user.userId}
                lastName={user.lastName}
                email={user.email}
                firstName={user.firstName}
                role={user.roles[0].roleName}
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
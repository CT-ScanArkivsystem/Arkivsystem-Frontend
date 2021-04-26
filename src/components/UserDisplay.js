import React, {useState} from "react";
import "./AdminTabs/FindUser.css";
import UserEditStore from "../stores/UserEditStore";
import "./UserDisplay.css";
import {onError} from "../libs/errorLib";
import DeleteUser from "../apiRequests/DeleteUser";
import ConfirmationModal from "./ConfirmationModal";

export default function UserDisplay({...props}) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState(() => handleDeleteUser);


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
        console.log("handleDeleteUser() " + props.firstName + " " + props.lastName + " (" + props.userId + ")")

        try {
            let wasUserDeleted = await DeleteUser(props.userId)
            if (wasUserDeleted !== null) {
                console.log("API return is not null");
                window.location.reload(false);
            } else {
                console.log("API return is null");
            }
        } catch (e) {
            onError(e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }


    }

    function openDeleteUserModal() {
        setIsModalOpen(true);
        setModalText("Delete user: " + props.firstName + " " + props.lastName + "?");
        setFunctionIfConfirmed(() => handleDeleteUser);
    }

    function closeModal() {
        setIsModalOpen(false)
    }

    function runSwitchCase() {
        switch (props.pageType3) {
            case "deleteUser":
                return (
                    <React.Fragment>
                        <ConfirmationModal
                            functionToCloseModal={closeModal}
                            isOpen={isModalOpen}
                            modalText={modalText}
                            functionIfConfirmed={functionIfConfirmed}
                        />
                        <tr onClick={() => openDeleteUserModal()} className="user-display">
                            <td className="user-display-field">{props.firstName} {props.lastName}</td>
                            <td className="user-display-field">{props.email}</td>
                            <td className="capitalize user-display-field">{props.role.replace("ROLE_", "").toLowerCase()}</td>
                        </tr>
                    </React.Fragment>
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

    return (
        <React.Fragment>
            {runSwitchCase()}
        </React.Fragment>

    )


}

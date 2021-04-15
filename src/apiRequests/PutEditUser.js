import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API request to edit a user's details by overwriting if param is not empty
 * Request is sent to 'CurrentIP/admin/editUser'
 *
 * @param userId Decides which user to edit
 * @param email Email address of user
 * @param firstName First name of user
 * @param lastName Last name of user
 * @param role Role of the user
 * @param password Password of the user
 * @return result The return from the backend API request. user object in this case
 */

export default async function PutEditUser(userId, email, firstName, lastName, role, password) {
    let result;
    try {
        let res = await fetch(currentIP + '/admin/editUser', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                role: role
            })
        });
        result = await res.json();
        if (result !== null && result !== "") {

        } else {
            result = [];
            console.log("Project was not created!");
        }

    } catch (e) {
        onError(e);
        console.log("User was not created due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return result;
}
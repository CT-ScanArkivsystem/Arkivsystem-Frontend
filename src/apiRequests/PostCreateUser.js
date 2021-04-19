import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to create a new user with the given parameters.
 *
 * @param firstName Users first name
 * @param lastName Users last name
 * @param email Users email
 * @param password Users password
 * @param role Users role
 * @returns boolean didUserGetCreated if user was successfully created returns true. Else false.
 */
export default async function PostCreateUser(firstName, lastName, email, password, role) {
    let didUserGetCreated = false;
    try {
        let res = await fetch(currentIP + '/admin/newUser', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                role: role
            })
        });
        let result = await res.json();
        if (result !== null && result !== "") {
            didUserGetCreated = true;
            // TODO: Pull information about the newly made user and show it on the page!
        } else {
            console.log("User was not created!");
        }
    } catch (e) {
        onError(e);
        console.log("User was not created due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return didUserGetCreated;
}

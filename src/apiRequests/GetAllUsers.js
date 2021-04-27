import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API GET request to the server to get all users.
 * Request is sent to 'CurrentIP/admin/allUsers'
 *
 * @param currentIP is the currently used IP for the backend API which the frontend makes calls to.
 * @returns boolean result if the user information was pulled successfully returns true. Else false
 */
export default async function GetAllUsers() {
    let result = [];
    try {
        let res = await fetch(currentIP + '/admin/allUsers', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
        });

        result = await res.json();

        if (res.ok) {
            // console.log("API: Got all users!");
        }
        else {
            result = [];
            console.log("API: Could not get users.");
        }

    } catch (e) {
        onError(e);
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return (result);
}

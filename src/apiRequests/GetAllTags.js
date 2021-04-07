import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API GET request to the server to get the current users information. The information is stored in the UserStore.
 * Request is sent to 'CurrentIP/user/currentUser'
 *
 * @param currentIP is the currently used IP for the backend API which the frontend makes calls to.
 * @returns boolean isUserLoggedIn if the user information was pulled successfully returns true. Else false
 */
export default async function GetAllProjects() {
    let result = [];
    try {
        let res = await fetch(currentIP + '/user/getAllTags', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
        });

        result = await res.json();

        if (result !== null && result.length > 0) {
            console.log("Got all tags!");
        } else {
            result = [];
            console.log("Could not get tags.");
        }

    } catch (e) {
        onError(e);
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return (result);
}
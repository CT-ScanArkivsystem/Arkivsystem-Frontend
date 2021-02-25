import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API GET request to the server to log the user out of the system. This is done by deleting the browsers cookie
 * which contains the authorization token. This is done automatically by the Set-Cookie header in the servers response.
 * Note, this does not check if the users token is deleted, but whether or not any errors occurred during the process.
 * Request is sent to 'CurrentIP/auth/logout'
 *
 * @param currentIP is the currently used IP for the backend API which the frontend makes calls to.
 * @returns boolean didUserGetLoggedOut if the user got logged out successfully, returns true. Else false.
 */
export default async function GetLogout() {
    let didUserGetLoggedOut = false;
    try {
        await fetch(currentIP + '/auth/logout', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
        });
        didUserGetLoggedOut = true;
    }
    catch (e) {
        onError(e);
        didUserGetLoggedOut = false;
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return(didUserGetLoggedOut);
}
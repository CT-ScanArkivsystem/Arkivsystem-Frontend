import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to create a new user with the given parameters.
 *
 * @returns boolean didUserGetCreated if user was successfully created returns true. Else false.
 * @constructor
 * @param projectId
 * @param setPrivacy
 */
export default async function SetProjectPrivacy(projectId, setPrivacy) {
    let wasSuccessful = false;
    try {
        let urlencoded = new URLSearchParams();
        urlencoded.append("projectId", projectId);
        urlencoded.append("privacy", setPrivacy);

        let res = await fetch(currentIP + '/academic/setProjectPrivacy', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded
        });

        wasSuccessful = true;

    } catch (e) {
        onError(e);
        wasSuccessful = false;
        console.log("Project privacy was not changed due to en ERROR!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return wasSuccessful;
}
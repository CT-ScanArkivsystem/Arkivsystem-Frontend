import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to create a new user with the given parameters.
 *
 * @returns boolean didUserGetCreated if user was successfully created returns true. Else false.
 * @constructor
 * @param projectId
 * @param setDescription
 */
export default async function SetProjectDescription(projectId, setDescription) {
    let wasSuccessful = false;
    try {
        let urlencoded = new URLSearchParams();
        urlencoded.append("projectId", projectId);
        urlencoded.append("description", setDescription);

        let res = await fetch(currentIP + '/academic/setProjectDescription', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded
        });

        if (res.ok) {
            wasSuccessful = true;
        }

    } catch (e) {
        onError(e);
        wasSuccessful = false;
        console.log("Project privacy was not changed due to en ERROR!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return wasSuccessful;
}
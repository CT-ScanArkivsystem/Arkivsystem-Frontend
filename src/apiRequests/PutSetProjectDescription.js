import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API PUT request to the server to update the description of a given project.
 *
 * @returns boolean wasSuccessful if no error codes were returned it will return true, else false.
 * @param projectId string (UUID) the projectId of the project you are trying to change the privacy settings of.
 * @param setDescription string which contains what the new description of the project should be.
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
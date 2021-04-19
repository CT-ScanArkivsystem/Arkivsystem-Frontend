import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API PUT request to the server to set the project privacy setting to either true or false.
 *
 * @returns boolean wasSuccessful if no error codes were returned it will return true, else false.
 * @param projectId string (UUID) the projectId of the project you are trying to change the privacy settings of.
 * @param setPrivacy boolean true if project will be set to private and false if removing private status.
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

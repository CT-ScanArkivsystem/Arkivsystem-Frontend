import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API PUT request to grant a user special permissions for the project.
 *
 * @param projectId String that identifies the project the user wants to add tags to.
 * @param userEmail the email of the member that is to be added to the project.
 * @returns Promise result the result from the server. Contains the project that was updated.
 */
export default async function PutGrantSpecialPermission(projectId, userEmail) {
    let res;
    try {
        let urlencoded = new URLSearchParams();
        urlencoded.append("projectId", projectId);
        urlencoded.append("userEmail", userEmail);

        res = await fetch(currentIP + '/academic/grantSpecialPermission', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded
        });

        if (res.ok) {
            // console.log("Special permission granted!");
            //console.log(res)
        } else {
            console.log("User was not added as member!");
        }
    } catch (e) {
        onError(e);
        console.log("User was not added as member due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return res;
}

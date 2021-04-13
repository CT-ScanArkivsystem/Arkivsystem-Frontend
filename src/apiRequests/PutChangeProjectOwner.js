import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API PUT request to change the owner of the project.
 *
 * @param projectId String that identifies the project the user wants to add tags to.
 * @param userId the id of the member that is to be made the owner of the project.
 * @returns Promise result the result from the server.
 */
export default async function PutChangeProjectOwner(projectId, userId) {
    let result = false;
    try {
        let res = await fetch(currentIP + '/academic/changeProjectOwner', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId: projectId,
                userId: userId
            })
        });

        if (res.ok) {
            //console.log("Owner was changed!");
            result = true;
        } else {
            console.log("Owner was not changed!");
            result = false;
        }
    } catch (e) {
        onError(e);
        console.log("Owner was not changed due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    console.log(result);
    return result;
}
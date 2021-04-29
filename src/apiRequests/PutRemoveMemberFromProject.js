import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API PUT request to remove a user from the list of members in a project.
 *
 * @param projectId String that identifies the project the user wants to add tags to.
 * @param userEmail the email of the member that is to be remove to the project.
 * @returns Promise result the result from the server. Contains the project that was updated.
 */
export default async function PutRemoveMemberFromProject(projectId, userEmail) {
    let result = false;
    try {
        let res = await fetch(currentIP + '/academic/removeMemberFromProject', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId: projectId,
                userEmail: userEmail
            })
        });

        if (res.ok) {
            //console.log("Member was added!");
            result = true;
        } else {
            result = false;
            console.log("User was not removed from project members!");
        }
    } catch (e) {
        onError(e);
        console.log("User was not removed as member due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return result;
}

import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API PUT request to add a user to the list of members for a project.
 *
 * @param projectId String that identifies the project the user wants to add tags to.
 * @param userEmail the email of the member that is to be added to the project.
 * @returns Promise result the result from the server. Contains the project that was updated.
 */
export default async function PutAddMemberToProject(projectId, userEmail) {
    let res;
    try {
        res = await fetch(currentIP + '/academic/addMemberToProject', {
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
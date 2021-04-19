import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API PUT request to add a tag to a project.
 *
 * @param projectId String that identifies the project the user wants to remove tags from.
 * @param tagNames any[] that holds the tags the user wants to remove from the project.
 * @returns Promise result the result from the server. Contains the project that was updated.
 */
export default async function PutRemoveTag(projectId, tagNames) {
    let result;
    try {
        let urlencoded = new URLSearchParams();
        urlencoded.append("projectId", projectId)
        tagNames.forEach(tag => {
            urlencoded.append("tagNames", tag);
        })

        let res = await fetch(currentIP + '/academic/removeTag', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded
        });
        result = await res.json();
        if (res.ok) {
            //console.log("Tags were removed")
        } else {
            result = [];
            console.log("Tags were not removed!");
        }
    } catch (e) {
        onError(e);
        console.log("Tags were not removed due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return result;
}

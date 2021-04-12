import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API PUT request to add a tag to a project.
 *
 * @param projectId String that identifies the project the user wants to add tags to.
 * @param tagNames any[] that holds the tags the user wants to add to the project.
 * @returns Promise result the result from the server. Contains the project that was updated.
 */
export default async function PutAddTag(projectId, tagNames) {
    let result;
    try {
        let urlencoded = new URLSearchParams();
        urlencoded.append("projectId", projectId)
        tagNames.forEach(tag => {
            urlencoded.append("tagNames", tag);
        })

        let res = await fetch(currentIP + '/academic/addTag', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded
        });
        result = await res.json();
        if (result && result !== "") {
            //console.log("Tags were added!");
        } else {
            result = [];
            console.log("Tags were not added!");
        }
    } catch (e) {
        onError(e);
        console.log("Tags were not added due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    console.log(result)
    return result;
}
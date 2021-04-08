import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to create a new user with the given parameters.
 *
 * @returns boolean didUserGetCreated if user was successfully created returns true. Else false.
 * @param projectId
 * @param tagNames
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
    return result;
}
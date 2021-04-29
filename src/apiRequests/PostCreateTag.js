import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to create a new tag.
 * Request is sent to 'CurrentIP/user/getAllFileNames'
 *
 * @returns Promise result from the server. This contains all the files in the projects directory.
 */
export default async function PostCreateTag(tagName) {
    let result = [];
    try {
        let urlencoded = new URLSearchParams();
        urlencoded.append("tagName", tagName);

        let res = await fetch(currentIP + '/academic/createTag', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlencoded
        });

        result = await res.json();

        if (res.ok) {
            //console.log("Got all files!");
            console.log(result);
        } else {
            result = [];
            console.log("Could not get files.");
        }

    } catch (e) {
        onError(e);
        //Send the user to the home page. Prevents the user from accessing sites when not logged in.
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return (result);
}

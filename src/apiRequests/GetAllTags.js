import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API GET request to the server to get all the tags.
 * Request is sent to 'CurrentIP/user/getAllTags'
 *
 * @returns Promise result the result from the server. This contains all the tags in the database.
 */
export default async function GetAllTags() {
    let result = [];
    try {
        let res = await fetch(currentIP + '/user/getAllTags', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
        });

        result = await res.json();

        if (res.ok) {
            //console.log("Got all tags");
        }
        else {
            result = [];
            console.log("Could not get tags.");
        }

    } catch (e) {
        onError(e);
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return (result);
}
import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API GET request to the server to get the current users projects.
 * Request is sent to 'CurrentIP/academic/getMyProjects'
 *
 * @returns Promise result the result from the server. This contains all the Projects in the database.
 */
export default async function GetMyProjects() {
    let res = [];
    try {
        res = await fetch(currentIP + '/academic/getMyProjects', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
        });

        if (res.ok) {
            //console.log("Got my projects!");
        } else {
            console.log("Could not get my projects.");
        }

    } catch (e) {
        onError(e);
        //Send the user to the home page. Prevents the user from accessing sites when not logged in.
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return (res);
}

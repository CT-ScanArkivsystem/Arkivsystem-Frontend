import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API GET request to the server to get the current projects sub folders.
 * The information is stored in the UserStore. Request is sent to 'CurrentIP/user/getAllProjectSubFolders'
 *
 * @returns Promise result from the server. This contains all the sub folders in the project.
 */
export default async function GetAllProjectSubFolders(projectId) {
    let result = [];
    try {
        let res = await fetch(currentIP + '/user/getAllProjectSubFolders?projectId=' + projectId, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });

        result = await res.json();

        if (res.ok) {
            //console.log("Got all sub folders!");
        } else {
            result = [];
            console.log("Could not get sub folders.");
        }

    } catch (e) {
        onError(e);
        //Send the user to the home page. Prevents the user from accessing sites when not logged in.
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return (result);
}
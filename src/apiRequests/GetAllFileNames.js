import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API GET request to the server to get the files in a directory in a project.
 * Request is sent to 'CurrentIP/user/getAllFileNames'
 *
 * @returns Promise result from the server. This contains all the files in the projects directory.
 */
export default async function GetAllFileNames(directory, projectId, subFolder) {
    let result = [];
    try {
        let res = await fetch(currentIP +
            '/user/getAllFileNames?directory=' + directory +
            '&projectId=' + projectId +
            '&subFolder=' + subFolder,
            {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            }
        });

        result = await res.json();

        if (res.ok) {
            //console.log("Got all files!");
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
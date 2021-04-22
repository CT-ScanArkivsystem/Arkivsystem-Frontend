import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API GET request to the server to get all projects within the search parameters.
 * Request is sent to 'CurrentIP/user/search'
 *
 * @returns Promise result the result from the server. This contains all the projects that fit the parameters.
 */
export default async function GetSearchForProjects(searchParam, tagFilter) {
    let res;
    try {
        res = await fetch(currentIP +
            '/user/search?search=' + searchParam +
            '&tagFilter=' + tagFilter,
            {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
        });

        if (res.ok) {
            //console.log("Got all projects");
        }
        else {
            res = false;
            console.log("Could not get projects.");
        }

    } catch (e) {
        onError(e);
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return (res);
}

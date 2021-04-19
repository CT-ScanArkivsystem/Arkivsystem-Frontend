import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API GET request to the server to get the current users information. The information is stored in the UserStore.
 * Request is sent to 'CurrentIP/user/currentUser'
 *
 * @returns Promise result the result from the server. This contains all the Projects in the database.
 */
export default async function GetAllProjects() {
    let result = [];
    try {
        let res = await fetch(currentIP + '/user/getAllProjects', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
        });

        result = await res.json();

        if (res.ok) {
            //console.log("Got all projects!");
            //console.log(result);
        } else {
            result = [];
            console.log("Could not get projects.");
        }

    } catch (e) {
        onError(e);
        //isUserLoggedIn = false;
        //Send the user to the home page. Prevents the user from accessing sites when not logged in.
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return (result);
}

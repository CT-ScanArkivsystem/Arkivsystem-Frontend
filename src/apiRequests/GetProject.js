import {onError} from "../libs/errorLib";
import {currentIP} from "../App";
import UserStore from "../stores/UserStore";
import ProjectStore from "../stores/ProjectStore";

/**
 * Sends an API GET request to the server to get the current users information. The information is stored in the UserStore.
 * Request is sent to 'CurrentIP/user/currentUser'
 *
 * @returns boolean isUserLoggedIn if the user information was pulled successfully returns true. Else false
 * @param projectId
 */
export default async function GetProject(projectId) {
    let result = '';
        try {
            let res = await fetch(currentIP + '/user/getProject?projectId=' + projectId, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                },
            });

            result = await res.json();

            if (result !== null && result !== "") {
                //console.log("Project was pulled");
            }
            else {
                console.log("Failed to pull project");
            }
        }
        catch (e) {
            onError(e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
        return(result);
}
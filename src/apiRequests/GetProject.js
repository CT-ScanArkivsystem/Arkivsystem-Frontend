import {onError} from "../libs/errorLib";
import {currentIP} from "../App";
import UserStore from "../stores/UserStore";
import ProjectStore from "../stores/ProjectStore";

/**
 * Sends an API GET request to the server to get a single project.
 * Request is sent to 'CurrentIP/user/getProject?projectId=PROJECT_ID_HERE'
 *
 * @param projectId String which contains the UUID of the project you are requesting information about.
 * @returns Promise result the result from the server. Contains all the information about a single project.
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

            if (res.ok) {
                //console.log("Project was pulled");
                //console.log(result);
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
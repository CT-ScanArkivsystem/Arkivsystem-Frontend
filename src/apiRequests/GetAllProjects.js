import {onError} from "../libs/errorLib";
import {currentIP} from "../App";
import Project from "../objects/Project";

/**
 * Sends an API GET request to the server to get the current users information. The information is stored in the UserStore.
 * Request is sent to 'CurrentIP/user/currentUser'
 *
 * @param currentIP is the currently used IP for the backend API which the frontend makes calls to.
 * @returns boolean isUserLoggedIn if the user information was pulled successfully returns true. Else false
 */
export default async function GetAllProjects() {
    let result = "";
    try {
        let res = await fetch(currentIP + '/professor/allProjects', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json'
            },
        });

        result = await res.json();

        console.log("Sending GetAllProjects request: ")
        if (result !== null && result !== "") {
            /*let currentProject = {
                projectId: "",
                projectName: "",
                isPrivate: false,
                tags: [],
                usersWithSpecialPermission: [],
                projectMembers: [],
            };*/
            console.log("Gathering all projects!");
        } else {
            result = "";
            console.log("Could not get projects.");
        }

    } catch (e) {
        onError(e);
        //isUserLoggedIn = false;
        //Send the user to the home page. Prevents the user from accessing sites when not logged in.
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    console.log("result in GetAllProjects.js: " + result);
    return (result);
}
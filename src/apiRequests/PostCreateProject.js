import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to create a new user with the given parameters.
 *
 * @param firstName Users first name
 * @param lastName Users last name
 * @param email Users email
 * @param password Users password
 * @param role Users role
 * @returns boolean didUserGetCreated if user was successfully created returns true. Else false.
 * @constructor
 */
export default async function PostCreateProject(projectName, isPrivate, creationDate, projectDescription) {
    let result;
    try {
        let res = await fetch(currentIP + '/academic/createProject', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectName: projectName,
                isPrivate: isPrivate,
                creation: creationDate,
                description: projectDescription,
            })
        });
        result = await res.json();
        if (result !== null && result !== "") {

        } else {
            result = [];
            console.log("Project was not created!");
        }
    } catch (e) {
        onError(e);
        console.log("Project was not created due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return result;
}
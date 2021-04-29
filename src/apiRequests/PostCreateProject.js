import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to create a new user with the given parameters.
 *
 * @param projectName
 * @param isPrivate
 * @param creationDate
 * @param projectDescription
 * @returns Promise result the result from the server. Contains information about the project that was just created.
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
        if (res.ok) {
            //console.log("Project was created")
        } else {
            console.log("Project was not created!");
        }
    } catch (e) {
        onError(e);
        console.log("Project was not created due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return result;
}

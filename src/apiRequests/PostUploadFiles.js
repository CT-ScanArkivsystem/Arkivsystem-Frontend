import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to upload files to a project on the server.
 *
 * @returns boolean didUserGetCreated if user was successfully created returns true. Else false.
 * @constructor
 * @param files that are going to be uploaded to the server.
 * @param projectId the id of the project which the files are going to be put under.
 */
export default async function PostUploadFiles(files, projectId) {
    let didFilesGetUploaded = false;
    try {
        let res = await fetch(currentIP + '/academic/uploadFiles', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                files: files,
                projectId: projectId
            })
        });
        let result = await res.json();
        if (result !== null && result !== "") {
            didFilesGetUploaded = true;
            // TODO: Pull information about the newly made user and show it on the page!
        } else {
            console.log("User was not created!");
        }
    } catch (e) {
        onError(e);
        console.log("User was not created due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return didFilesGetUploaded;
}
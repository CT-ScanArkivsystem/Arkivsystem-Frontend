import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to upload files to a project on the server.
 *
 * @param files that are going to be uploaded to the server.
 * @param projectId the id of the project which the files are going to be put under.
 * @returns boolean didUserGetCreated if user was successfully created returns true. Else false.
 */
export default async function PostUploadFiles(files, projectId) {
    let result = false;
    try {
        let formData = new FormData();
        files.forEach(file => {
            formData.append("files", file);
        })
        formData.append("projectId", projectId);

        let res = await fetch(currentIP + '/academic/uploadFiles', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        result = await res.json();
        console.log(result);
        // result.length is the same as result.length > 0
        if (result && !result.length) {
            console.log("Upload was successful.")
        } else {
            console.log("Upload encountered a problem!");
        }
    } catch (e) {
        onError(e);
        console.log("Files were not uploaded due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return result;
}
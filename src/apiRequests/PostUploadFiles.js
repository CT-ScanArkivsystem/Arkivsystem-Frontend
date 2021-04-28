import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to upload files to a project on the server.
 *
 * @param files that are going to be uploaded to the server.
 * @param projectId of the project which the files are going to be put under.
 * @param subFolder that the user wanted to upload the files to.
 * @returns boolean didUserGetCreated if user was successfully created returns true. Else false.
 */
export default async function PostUploadFiles(files, projectId, subFolder) {
    let result = false;
    try {
        let formData = new FormData();
        files.forEach(file => {
            formData.append("files", file);
        })
        formData.append("projectId", projectId);
        formData.append("subFolder", subFolder);

        let res = await fetch(currentIP + '/academic/uploadFiles', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });

        result = await res.json();
        // result.length is the same as result.length > 0
        if (res.ok) {
            //console.log("Upload was successful.")
            //console.log(result);
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

import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API GET request to the server to get the files in a directory in a project.
 * Request is sent to 'CurrentIP/user/getAllFileNames'
 *
 * @returns Promise result from the server. This contains all the files in the projects directory.
 */
export default async function PostDownloadFile(fileNames, projectId, subFolder) {
    let result = [];
    try {
        let urlencoded = new URLSearchParams();
        urlencoded.append("projectId", projectId);
        urlencoded.append("subFolder", subFolder);
        fileNames.forEach(file => {
            urlencoded.append("fileName", file);
            //console.log(file);
        });

        let res = await fetch(currentIP + '/user/downloadFile', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlencoded
        });

        let dataAsBlob = await res.blob();
        const url = window.URL.createObjectURL(new Blob([dataAsBlob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileNames.length > 1 ? (subFolder + `Files.zip`) : fileNames[0]}`);

        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        if (res.ok) {
            //console.log("Got all files!");
            console.log(result);
        } else {
            result = [];
            console.log("Could not get files.");
        }

    } catch (e) {
        onError(e);
        //Send the user to the home page. Prevents the user from accessing sites when not logged in.
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return (result);
}

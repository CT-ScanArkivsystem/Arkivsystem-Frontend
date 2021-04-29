import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to get the images in a subFolder.
 * Request is sent to 'CurrentIP/user/getAllFileNames'
 *
 * @returns Promise result from the server. This contains all the files in the projects directory.
 */
export default async function PostGetImage(imageName, projectId, subFolder, size) {
    let result;
    try {
        let urlencoded = new URLSearchParams();
        urlencoded.append("imageName", imageName);
        urlencoded.append("projectId", projectId);
        urlencoded.append("subFolder", subFolder);
        urlencoded.append("size", size);

        let res = await fetch(currentIP + '/user/getImage', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: urlencoded
        });

        //link.setAttribute('download', `${fileNames.length > 1 ? (subFolder + `Files.zip`) : fileNames[0]}`);

        //link.click();
        //link.parentNode.removeChild(link);

        if (res.ok) {
            //console.log("Got image!");
            let blob = await res.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            result = {
                imageName: imageName,
                imageSrc: url
            };
            //console.log(result);
        } else {
            result = [];
            console.log("Could not get image.");
        }

    } catch (e) {
        onError(e);
        //Send the user to the home page. Prevents the user from accessing sites when not logged in.
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return (result);
}

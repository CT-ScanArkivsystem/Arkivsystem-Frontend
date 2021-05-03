import {currentIP} from "../App";
import {onError} from "../libs/errorLib";


export default async function DeleteProject(projectId) {
    let res;
    try {
        res = await fetch(currentIP + '/academic/deleteProject', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                projectId: projectId
            })
        });
        if (res.ok) {
            //console.log("deleteTags: 200 OK");
        } else {
            console.log("Project was not deleted!");
        }
    } catch (e) {
        onError(e);
        console.log("DeleteProject caught an exception!");
    }
    return res;

}

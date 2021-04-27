import {currentIP} from "../App";
import {onError} from "../libs/errorLib";


export default async function DeleteTags(tagNames) {
    let result;
    try {
        let urlencoded = new URLSearchParams();
        tagNames.forEach(tag => {
            urlencoded.append("tagNames", tag.tagName);
        })

        let res = await fetch(currentIP + '/admin/deleteTags', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlencoded
        });
        result = await res.json();
        if (res.ok) {
            //console.log("deleteTags: 200 OK");
        } else {
            result = [];
            console.log("Tags were not deleted!");
        }
    } catch (e) {
        onError(e);
        console.log("DeleteTags caught an exception!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    console.log(result)
    return result;

}

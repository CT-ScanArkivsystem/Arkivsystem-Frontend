import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

export default async function DeleteUser(userId) {
    let result;
    try {
        let res = await fetch(currentIP + '/admin/deleteUser', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId: userId})
        });
    } catch (e) {
        onError(e);
        console.log("js api has caught an error");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return result;
}

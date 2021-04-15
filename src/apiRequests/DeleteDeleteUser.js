import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

export default async function DeleteDeleteUser(userId) {
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
        result = await res.json();
        if (res.ok) {
            console.log("200 OK: Successfully deleted user")

        } else {
            result = [];
            console.log("API call error");
        }

    } catch (e) {
        onError(e);
        console.log("User was not created due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return result;
}
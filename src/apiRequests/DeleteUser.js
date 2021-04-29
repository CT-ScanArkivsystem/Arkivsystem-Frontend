import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

export default async function DeleteUser(userId) {
    try {
        let res = await fetch(currentIP + '/admin/deleteUser', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId: userId})
        });
        if (res.ok) {
            console.log("api: Deleted user")
        } else {
            console.log("api: User not deleted");
        }

    } catch (e) {
        onError(e);
        console.log("js api has caught an error");
    }
}

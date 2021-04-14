import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

export default async function PutEditUser(userId, email, firstName, lastName, role, password) {
    let result;
    try {
        let res = await fetch(currentIP + '/admin/editUser', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                role: role
            })
        });
        result = await res.json();
        if (result !== null && result !== "") {

        } else {
            result = [];
            console.log("Project was not created!");
        }

    } catch (e) {
        onError(e);
        console.log("User was not created due to an error!");
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return result;
}
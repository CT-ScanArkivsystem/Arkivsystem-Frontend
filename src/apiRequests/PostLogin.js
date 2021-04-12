import {onError} from "../libs/errorLib";
import {currentIP} from "../App";

/**
 * Sends an API POST request to the server to try to login with the given email and password.
 * Request is sent to 'CurrentIP/auth/login'
 *
 * @param email of the user. Must be in email format.
 * @param password of the user. Must be at least 5 characters long.
 * @returns boolean didUserGetLoggedIn if the login was a success, returns true. Else false.
 */
export default async function PostLogin(email, password) {
    let didUserGetLoggedIn = false;
    try {
        let res = await fetch (currentIP + '/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            //NB! In the backend the login system treats the email to login as username. 16.02.2021
            body: JSON.stringify({
                username: email,
                password: password
            })
        });

        let result = await res.json();
        if (result.success) {
            didUserGetLoggedIn = true;
        }
    }
    catch (e) {
        onError(e);
        didUserGetLoggedIn = false;
        //Send the user to the home page. Prevents the user from accessing sites when not logged in.
        //TODO: TELL THE USER SOMETHING WENT WRONG!
    }
    return(didUserGetLoggedIn);
}
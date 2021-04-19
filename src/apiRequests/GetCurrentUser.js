import {onError} from "../libs/errorLib";
import {currentIP} from "../App";
import UserStore from "../stores/UserStore";

/**
 * Sends an API GET request to the server to get the current users information. The information is stored in the UserStore.
 * Request is sent to 'CurrentIP/user/currentUser'
 *
 * @returns boolean isUserLoggedIn if the user information was pulled successfully returns true. Else false
 */
export default async function GetCurrentUser() {
    let isUserLoggedIn = false;
        try {
            let res = await fetch(currentIP + '/user/currentUser', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                },
            });

            let result = await res.json();

            if (res.ok) {
                //console.log("User is logged in. Gathering user information!");
                UserStore.userId = result.userId;
                UserStore.email = result.email;
                UserStore.firstName = result.firstName;
                UserStore.lastName = result.lastName;
                result.roles.forEach((selectedRole) => {
                    UserStore.role = selectedRole.roleName;
                })
                isUserLoggedIn = true;
            }
            else {
                console.log("User is not logged in. No information stored.");
                isUserLoggedIn = false;
            }
        }
        catch (e) {
            onError(e);
            isUserLoggedIn = false;
            //Send the user to the home page. Prevents the user from accessing sites when not logged in.
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
        return(isUserLoggedIn);
}

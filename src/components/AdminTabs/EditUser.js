import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import {Table} from "react-bootstrap";
import UserResultRows from "./UserResultRows";
import './EditUser.css';
import LoaderButton from "../LoaderButton";
import UserEditStore from "../../stores/UserEditStore";
import PostCreateUser from "../../apiRequests/PostCreateUser";
import {onError} from "../../libs/errorLib";
import PutEditUser from "../../apiRequests/PutEditUser";

export default function EditUser({...props}) {

    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [role, setRole] = useState("");


    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        initialisation();
    }, []);

    async function initialisation() {
        setIsLoading(false);
        setFirstName(UserEditStore.firstName)
        console.log("firstName for this user is: " + UserEditStore.firstName)
        setLastName(UserEditStore.lastName)
        console.log("lastName for this user is: " + UserEditStore.lastName)
        setEmail(UserEditStore.email)
        console.log("email for this user is: " + UserEditStore.email)
        setRole(UserEditStore.role)
        console.log("role for this user is: " + UserEditStore.role)
        setUserId(UserEditStore.userId)
        console.log("userId for this user is: " + UserEditStore.userId)
    }

    function clearUserEditStore() {
        UserEditStore.firstName = ""
        UserEditStore.lastName = ""
        UserEditStore.email = ""
        UserEditStore.role = ""
        UserEditStore.userId = ""
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("HandleSubmit! in EditUser")
        try {
            let didUserGetSaved = await PutEditUser(userId, email, firstName, lastName, role, password1)
            if (didUserGetSaved !== null) {
                //userHasAuthenticated(true);
                // TODO: Should redirect to admin page when it is complete!!!
                // history.push("/userFrontpage");
                console.log("User has been saved!");
                clearUserEditStore()
                props.backToFindUser()
            } else {
                console.log("User was not created!");
            }
        } catch (e) {
            setIsLoading(false);
            onError(e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
    }

    /**
     * Checks if both form inputs have something put into them.
     * @returns {boolean}
     */
    function validateForm() {
        return (firstName.length > 0 && lastName.length > 0 && email.length > 0 && password1.length > 0 && password2.length === password1.length && role.length > 0);
    }

    function displayFormError(error) {
        let inputError = "";

        if (firstName.trim().length < 1 || firstName.trim().length > 255) {
            inputError = "First name is either empty or too long!";
        } else if (lastName.trim().length < 1 || lastName.trim().length > 255) {
            inputError = "Last name is either empty or too long!";
        } else if (email.trim().length < 1 || email.trim().length > 255) {
            inputError = "Email is either empty or too long!";
        } else if (role.trim().length < 1 || role.trim().length > 255) {
            inputError = "Role has not been selected!";
        } else if (password2 !== password1) {
            inputError = "Second password is not equal to the first password!";
        }
        return inputError;
    }




    return (
        !isLoading && (
            <div className="editUser">
                <div className="tabHeader">
                    <h2>Edit user:</h2>
                </div>
                <div className="tabContent">
                    <Form className="formContainer" onSubmit={handleSubmit}>
                        <div className="first-lastname-box">
                            <Form.Group className="firstName" size="lg" controlId="firstName">
                                <Form.Label>First name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={firstName}
                                    default
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="lastName" size="lg" controlId="lastName">
                                <Form.Label>Last name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}


                                />
                            </Form.Group>
                        </div>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                // autoFocus
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <div className="password-box">
                            <Form.Group className="password1" size="lg" controlId="password1">
                                <Form.Label>New password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password1}
                                    onChange={(e) => setPassword1(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="password2" size="lg" controlId="password2">
                                <Form.Label>Enter new password again</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <Form.Group size="lg" controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="select"
                                onChange={(e) => setRole(e.target.value)}
                                value={role}
                            >
                                <option value="" disabled>Choose a role</option>
                                <option value="user">User</option>
                                <option value="academic">Academic</option>
                                <option value="admin">Admin</option>
                            </Form.Control>

                        </Form.Group>

                        <LoaderButton
                            block
                            size="lg"
                            type="submit"
                            isLoading={isLoading}
                            disabled={false}
                        >
                            Edit user
                        </LoaderButton>
                        <p className="errorMessage">{displayFormError()}</p>
                    </Form>
                </div>
            </div>
        )
    )
}
import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import {useAppContext} from "../../libs/contextLib";
import {onError} from "../../libs/errorLib";
import "./CreateUser.css";
import LoaderButton from "../LoaderButton";
import PostCreateUser from "../../apiRequests/PostCreateUser";
import SuccessModal from "../SuccessModal";

export default function CreateUser() {
    const {userHasAuthenticated} = useAppContext();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [role, setRole] = useState("user");
    const [isLoading, setIsLoading] = useState(false);
    const [editedFirstName, setEditedFirstName] = useState(false)
    const [editedLastName, setEditedLastName] = useState(false)
    const [editedEmail, setEditedEmail] = useState(false)
    const [editedPassword1, setEditedPassword1] = useState(false)
    const [editedPassword2, setEditedPassword2] = useState(false)


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState();


    /**
     * Checks if both form inputs have something put into them.
     * @returns {boolean}
     */
    function validateForm() {
        return (firstName.trim().length > 0 && lastName.trim().length > 0 && email.trim().length > 0 && validateEmail(email.trim()) && password1.trim().length > 0 && password2.trim().length === password1.trim().length && role.trim().length > 0);
    }

    /**
     * https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript/46181#46181
     * @param email
     * @returns {boolean}
     */
    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        try {
            let didUserGetCreated = PostCreateUser(firstName, lastName, email, password1, role);
            if (didUserGetCreated) {
                userHasAuthenticated(true);
                setIsLoading(false);
                openModal()
                // window.location.reload(false);
            } else {
                console.log("User was not created!");
            }
        } catch (e) {
            setIsLoading(false);
            onError(e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }
    }

    function setStatesToEmpty() {
        setFirstName("")
        setEditedFirstName(false)
        setLastName("")
        setEditedLastName(false)
        setEmail("")
        setEditedEmail(false)
        setPassword1("")
        setEditedPassword1(false)
        setPassword2("")
        setEditedPassword2(false)
        setRole("User")
    }

    function displayFormError() {
        let inputError = "";

        if ((firstName.trim().length < 1 || firstName.trim().length > 255) && editedFirstName) {
            inputError = "First name is either empty or too long!";
        } else if ((lastName.trim().length < 1 || lastName.trim().length > 255) && editedLastName) {
            inputError = "Last name is either empty or too long!";
        } else if ((email.trim().length < 1 || email.trim().length > 255 || !validateEmail(email.trim())) && editedEmail) {
            inputError = "Email is either too long or in the wrong format!";
        } else if ((password1.trim().length < 5 || password1.trim().length > 255) && editedPassword1) {
            inputError = "First password field is either empty, not long enough or too long!";
        } else if ((password2 !== password1) && editedPassword2) {
            inputError = "Second password is not equal to the first password!";
        }

        return inputError;
    }

    function openModal() {
        setIsModalOpen(true);
        setModalText("User created successfully");
    }

    function closeModal() {
        setIsModalOpen(false)
        setStatesToEmpty()
    }

    function handleFirstName(string) {
        setEditedFirstName(true)
        setFirstName(string)
    }

    function handleLastName(string) {
        setEditedLastName(true)
        setLastName(string)
    }

    function handleEmail(string) {
        setEditedEmail(true)
        setEmail(string)
    }

    function handlePassword1(string) {
        setEditedPassword1(true)
        setPassword1(string)
    }

    function handlePassword2(string) {
        setEditedPassword2(true)
        setPassword2(string)
    }

    // The formatting for the bootstrap Form can be found here: https://react-bootstrap.github.io/components/forms/
    return (
        <div className="createUser">
            <div className="tabHeader">
                <h2>Create a new user:</h2>
            </div>
            <div className="tabContent">
                <SuccessModal
                    functionToCloseModal={closeModal}
                    isOpen={isModalOpen}
                    modalText={modalText}
                    functionIfConfirmed={functionIfConfirmed}
                />
                <Form className="formContainer" onSubmit={handleSubmit}>
                    <div className="first-lastname-box">
                        <Form.Group className="firstName" size="lg" controlId="firstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                autoFocus
                                type="text"
                                value={firstName}
                                onChange={(e) => handleFirstName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="lastName" size="lg" controlId="lastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={(e) => handleLastName(e.target.value)}
                            />
                        </Form.Group>
                    </div>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => handleEmail(e.target.value)}
                        />
                    </Form.Group>
                    <div className="password-box">
                        <Form.Group className="password1" size="lg" controlId="password1">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password1}
                                onChange={(e) => handlePassword1(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="password2" size="lg" controlId="password2">
                            <Form.Label>Repeat password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password2}
                                onChange={(e) => handlePassword2(e.target.value)}
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
                        disabled={!validateForm()}
                    >
                        Create user
                    </LoaderButton>
                    <p className="errorMessage">{displayFormError()}</p>
                </Form>
            </div>
        </div>
    );
}

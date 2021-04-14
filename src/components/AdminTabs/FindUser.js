import React, {useState} from "react";
import "./FindUser.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "../LoaderButton";
import GetAllUsers from "../../apiRequests/GetAllUsers";
import {Table} from "react-bootstrap";
import UserDisplay from "../UserDisplay";
import {onError} from "../../libs/errorLib";
import UserResultRows from "./UserResultRows";

export default function FindUser({...props}) {
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [doesHaveUsers, setDoesHaveUsers] = useState(false);

    const [searchField, setSearchField] = useState("");
    const [searchShow, setSearchShow] = useState(false);
    const filteredPersons = allUsers.filter(
        person => {
            const fullName = person.firstName + " " + person.lastName
            return (
                person
                    .email
                    .toLowerCase()
                    .includes(searchField.toLowerCase()) ||
                person
                    .lastName
                    .toLowerCase()
                    .includes(searchField.toLowerCase()) ||
                person
                    .firstName
                    .toLowerCase()
                    .includes(searchField.toLowerCase()) ||
                fullName
                    .toLowerCase()
                    .includes(searchField.toLowerCase())
            );
        }
    );

    const handleChange = e => {
        setSearchField(e.target.value);
        setSearchShow(true);
    };


    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        initialisation();
    }, []);

    async function initialisation() {
        setIsLoading(false);
        initGetAllUsers()
        console.log(allUsers)
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("HandleSubmit! in FindUser")
    }

    function validateForm() {
        return true;
        // TODO: Validate when you know how to validate
    }

    async function initGetAllUsers() {
        try {
            if (!doesHaveUsers) {
                setAllUsers(await GetAllUsers())
                if (allUsers.length >= 0) {
                    setDoesHaveUsers(true)
                    setIsLoading(false)
                }
            }
        } catch (e) {
            onError(e)
        }

    }

    return (
        !isLoading && (
            <div className="findUser">
                <div className="tabHeader">
                    <h2>Edit user:</h2>
                </div>
                <div className="thisPagesContent">

                    <Form className="formContainer" onSubmit={handleSubmit}>
                        <Form.Group size="lg">
                            <Form.Control
                                className="searchFormControl"
                                type="search"
                                placeholder="Search People"
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>

                    <div className="user-list-box">
                        <Table className="table table-striped table-bordered">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                            </thead>
                            <tbody>
                            <UserResultRows
                                filteredPersons={filteredPersons}
                                onSomethingHappens={() => {props.reallyDoThis()}
                                }
                            />
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        )
    )
}
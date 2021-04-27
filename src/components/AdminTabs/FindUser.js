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


    let filteredPeople = allUsers.filter(
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
        await initGetAllUsers()
    }

    async function initGetAllUsers() {
        try {
            if (!doesHaveUsers) {
                let users = await GetAllUsers()
                setAllUsers(users)
                if (allUsers.length >= 0) {
                    setDoesHaveUsers(true)
                    setIsLoading(false)
                }
            }
        } catch (e) {
            onError(e)
        }
    }

    async function updateUsers() {
        setIsLoading(true)
        let users = await GetAllUsers()
        setAllUsers(users)
        setIsLoading(false)
    }

    return (
        !isLoading && (
            <div className="findUser">
                <div className="tabHeader">
                    <h2>{props.pageTitle}</h2>
                </div>
                <div className="thisPagesContent">

                    <Form className="formContainer">
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
                                filteredPersons={filteredPeople}
                                EditPageEvent2={() => {
                                    props.EditPageEvent3()
                                }}
                                pageType2={props.pageType1}
                                initUsersAgain2={() => {
                                    updateUsers()
                                }}
                            />
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        )
    )
}

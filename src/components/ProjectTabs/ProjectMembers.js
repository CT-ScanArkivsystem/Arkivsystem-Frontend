import React, {useState} from "react";
import "./ProjectMembers.css";
import ProjectStore from "../../stores/ProjectStore";
import Form from "react-bootstrap/Form";
import LoaderButton from "../LoaderButton";
import {BsArrowRepeat} from "react-icons/bs";
import Button from "react-bootstrap/Button";


export default function ProjectMembers(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [userToAddAsMember, setUserToAddAsMember] = useState("");

    return (
        <div className="projectMembers">
            <div className="tabHeader">
                <h2>Manage members</h2>
            </div>
            <div className="tabContent">
                <div className="memberListContainer">
                    <h5>Members</h5>
                    <div className="memberList">
                        MEMBERLIST
                    </div>
                    <div className="memberButtons">
                        <LoaderButton
                            className="grantOwnershipButton"
                            size="sm"
                            type="submit"
                            isLoading={isLoading}
                            disabled={!props.canEditMembers}
                            onClick={() => {console.log("Click!")}}
                        >
                            Grant ownership
                        </LoaderButton>
                        <Button
                            variant={"outline-danger"}
                            disabled={isLoading || !props.canEditMembers}
                            className="removeMemberButton"
                            {...props}
                        >
                            {isLoading && <BsArrowRepeat className="spinning"/>}
                            Remove member
                        </Button>
                    </div>

                </div>
                <div className="informationAndAddMember">
                    <div className="information">
                        <span>Current owner: {ProjectStore.projectOwner.firstName + " " + ProjectStore.projectOwner.lastName}</span><br/>
                        <span>Owner E-mail: {ProjectStore.projectOwner.email}</span>
                    </div>
                        <Form.Group size="lg" controlId="projectDescription" className="addMemberField">
                            <Form.Label className="addMemberLabel">Add member</Form.Label>
                            <div className="formInputAndButton">
                                <Form.Control
                                    className="addMemberInput"
                                    type="email"
                                    name="Project description"
                                    placeholder="Enter email"
                                    value={userToAddAsMember}
                                    onChange={(e) => setUserToAddAsMember(e.target.value)}
                                />
                                <LoaderButton
                                    className="addMemberButton"
                                    size="sm"
                                    type="submit"
                                    isLoading={isLoading}
                                    disabled={!props.canEditMembers}
                                    onClick={() => {console.log("Click!")}}
                                >
                                    Add member
                                </LoaderButton>
                            </div>
                        </Form.Group>
                </div>
            </div>
        </div>
    );
}
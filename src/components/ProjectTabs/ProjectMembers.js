import React, {useState} from "react";
import "./ProjectMembers.css";
import ProjectStore from "../../stores/ProjectStore";
import Form from "react-bootstrap/Form";
import LoaderButton from "../LoaderButton";
import MemberDisplay from "../MemberDisplay";
import PutAddMemberToProject from "../../apiRequests/PutAddMemberToProject";
import PutRemoveMemberFromProject from "../../apiRequests/PutRemoveMemberFromProject";
import GetProject from "../../apiRequests/GetProject";
import PutChangeProjectOwner from "../../apiRequests/PutChangeProjectOwner";


export default function ProjectMembers(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState([]);
    const [emailOfUserToAdd, setEmailOfUserToAdd] = useState("");

    const [memberList, setMemberList] = useState([]);

    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        setMemberList(ProjectStore.projectMembers);
    }, []);


    function renderMemberList() {
        let result = [];

        result = memberList.map((memberToDisplay) => {
            return (
                <MemberDisplay
                    variant={memberToDisplay.userId === selectedMember.userId ? 'secondary' : 'outline-dark'}
                    onClick={() => {selectedMember === memberToDisplay ? setSelectedMember([]) : setSelectedMember(memberToDisplay)}}
                    key={memberToDisplay.userId}
                    id={memberToDisplay.userId}
                    memberfirstname={memberToDisplay.firstName}
                    memberlastname={memberToDisplay.lastName}
                    memberemail={memberToDisplay.email}
                />
            )
        });

        return result;
    }

    async function handleAddMember(projectId, emailOfUserToAdd) {
        if (emailOfUserToAdd) {
            let result = await PutAddMemberToProject(projectId, emailOfUserToAdd);
            if (result) {
                await updateProject(projectId);
            }
        }
    }
    async function handleRemoveMember(projectId, emailOfUserToRemove) {
        if (emailOfUserToRemove) {
            let result = await PutRemoveMemberFromProject(projectId, emailOfUserToRemove);
            if (result) {
                await updateProject(projectId);
            }
        }
    }

    async function updateProject(projectId) {
        let project = await GetProject(projectId);
        ProjectStore.projectMembers = project.projectMembers;
        ProjectStore.projectOwner = project.owner;
        setMemberList(ProjectStore.projectMembers);
        setSelectedMember([]);
        setIsLoading(false);
    }

    async function handleChangeOwner(projectId, idOfUserToOwner) {
        console.log("prosjektId: " + projectId)
        console.log("idOfuserToOwner: " + idOfUserToOwner)
        if (idOfUserToOwner) {
            let result = await PutChangeProjectOwner(projectId, idOfUserToOwner);
            if (result) {
                await updateProject(projectId);
            }
        }
    }


    return (
        <div className="projectMembers">
            <div className="tabHeader">
                <h2>Manage members</h2>
            </div>
            <div className="tabContent">
                <div className="memberListContainer">
                    <h5>Members</h5>
                    <div className="memberList">
                        {renderMemberList()}
                    </div>
                    <div className="memberButtons">
                        <LoaderButton
                            className="grantOwnershipButton"
                            size="sm"
                            variant="outline-primary"
                            isLoading={isLoading}
                            disabled={isLoading || !props.canEditMembers || !selectedMember.email}
                            onClick={() => {handleChangeOwner(ProjectStore.projectId, selectedMember.userId)}}
                        >
                            Grant ownership
                        </LoaderButton>
                        <LoaderButton
                            className="removeMemberButton"
                            size="sm"
                            variant="outline-danger"
                            isLoading={isLoading}
                            disabled={isLoading || !props.canEditMembers || !selectedMember.email}
                            onClick={() => {handleRemoveMember(ProjectStore.projectId, selectedMember.email)}}
                        >
                            Remove member
                        </LoaderButton>
                    </div>

                </div>
                <div className="informationAndAddMember">
                    <div className="information">
                        <span>Current owner: {isLoading ? 'Loading' : (ProjectStore.projectOwner.firstName + " " + ProjectStore.projectOwner.lastName)}</span><br/>
                        <span>Owner E-mail: {isLoading ? 'Loading' : (ProjectStore.projectOwner.email)}</span>
                    </div>
                        <Form.Group size="lg" controlId="projectDescription" className="addMemberField">
                            <Form.Label className="addMemberLabel">Add member</Form.Label>
                            <div className="formInputAndButton">
                                <Form.Control
                                    className="addMemberInput"
                                    type="email"
                                    name="Project description"
                                    placeholder="Enter email"
                                    disabled={isLoading || !props.canEditMembers}
                                    value={emailOfUserToAdd}
                                    onChange={(e) => setEmailOfUserToAdd(e.target.value)}
                                />
                                <LoaderButton
                                    className="addMemberButton"
                                    size="sm"
                                    type="submit"
                                    isLoading={isLoading}
                                    disabled={isLoading || !props.canEditMembers}
                                    onClick={() => {handleAddMember(ProjectStore.projectId, emailOfUserToAdd)}}
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
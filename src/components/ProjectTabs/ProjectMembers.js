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
import ConfirmationModal from "../ConfirmationModal";

export default function ProjectMembers(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState([]);
    const [emailOfUserToAdd, setEmailOfUserToAdd] = useState("");
    const [memberList, setMemberList] = useState(ProjectStore.projectMembers);

    //Modal helper states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState(handleRemoveMember);
    //Error handling state
    const [errorMessage, setErrorMessage] = useState("");

    function renderMemberList() {
        let result = [];

        result = memberList.map((memberToDisplay) => {
            return (
                <MemberDisplay
                    variant={memberToDisplay.userId === selectedMember.userId ? 'secondary' : 'outline-dark'}
                    onClick={() => {
                        if (selectedMember === memberToDisplay) {
                            setSelectedMember([]);
                        } else {
                            setSelectedMember(memberToDisplay);
                        }
                    }}
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

            console.log(result.status)

            switch (result.status) {
                case 200:
                    setErrorMessage("");
                    await updateProject(projectId);
                    break;
                case  400:
                    setErrorMessage("User is already a member!")
                    break;
                case 403:
                    setErrorMessage("User does not have the permission to be added as a member!")
                    break;
                case 404:
                    setErrorMessage("A user with that email does not exist!")
                    break;
                default:
                    break;
            }

        }
    }

    function openRemoveModal() {
        setIsModalOpen(true);
        setModalText("Remove " + selectedMember.firstName + " " + selectedMember.lastName + " from this project?");
        setFunctionIfConfirmed(() => handleRemoveMember);
    }

    async function handleRemoveMember() {
        setIsLoading(true);
        if (selectedMember.email) {
            let result = await PutRemoveMemberFromProject(ProjectStore.projectId, selectedMember.email);
            if (result) {
                await updateProject(ProjectStore.projectId);
            }
        }
        setIsLoading(false);
    }

    async function updateProject(projectId) {
        let project = await GetProject(projectId);
        ProjectStore.projectMembers = project.projectMembers;
        ProjectStore.projectOwner = project.owner;
        setMemberList(ProjectStore.projectMembers);
        setSelectedMember([]);
        setIsLoading(false);
    }

    function openGrantOwnerModal() {
        setIsModalOpen(true);
        setModalText("Make " + selectedMember.firstName + " " + selectedMember.lastName + " owner of this project?");
        setFunctionIfConfirmed(() => handleChangeOwner);
    }

    async function handleChangeOwner() {
        setIsLoading(true);
        if (selectedMember.userId) {
            let result = await PutChangeProjectOwner(ProjectStore.projectId, selectedMember.userId);
            if (result) {
                await updateProject(ProjectStore.projectId);
            }
        }
        setIsLoading(false);
    }

    function closeModal() {
        setIsModalOpen(false)
    }

    return (
        <div className="projectMembers">
            <ConfirmationModal
                functionToCloseModal={closeModal}
                isOpen={isModalOpen}
                modalText={modalText}
                functionIfConfirmed={functionIfConfirmed}
            />
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
                            className="removeMemberButton"
                            size="sm"
                            variant="outline-danger"
                            isLoading={isLoading}
                            disabled={isLoading || !props.canEditMembers || !selectedMember.email}
                            onClick={() => {
                                openRemoveModal()
                                //handleRemoveMember(ProjectStore.projectId, selectedMember.email)
                            }}
                        >
                            Remove member
                        </LoaderButton>
                        <LoaderButton
                            className="grantOwnershipButton"
                            size="sm"
                            variant="outline-primary"
                            isLoading={isLoading}
                            disabled={isLoading || !props.canEditMembers || !selectedMember.email}
                            onClick={() => {
                                openGrantOwnerModal()
                                //handleChangeOwner(ProjectStore.projectId, selectedMember.userId)
                            }}
                        >
                            Grant ownership
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
                                    name="Add member"
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
                                    disabled={isLoading || !props.canEditMembers || emailOfUserToAdd.length < 1}
                                    onClick={() => {handleAddMember(ProjectStore.projectId, emailOfUserToAdd)}}
                                >
                                    Add member
                                </LoaderButton>
                            </div>
                            <span className="errorMessage">{errorMessage}</span>
                        </Form.Group>
                </div>
            </div>
        </div>
    );
}

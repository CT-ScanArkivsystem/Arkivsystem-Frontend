import React, {useEffect, useState} from "react";
import "./ProjectSpecialPermission.css";
import ConfirmationModal from "../ConfirmationModal";
import LoaderButton from "../LoaderButton";
import ProjectStore from "../../stores/ProjectStore";
import Form from "react-bootstrap/Form";
import MemberDisplay from "../MemberDisplay";
import PutGrantSpecialPermission from "../../apiRequests/PutGrantSpecialPermission";
import GetProject from "../../apiRequests/GetProject";
import PutRevokeSpecialPermission from "../../apiRequests/PutRevokeSpecialPermission";
import InformationBubble from "../InformationBubble";


export default function ProjectSpecialPermission(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);
    const [emailOfUserToGrant, setEmailOfUserToGrant] = useState("");
    const [specialPermissionUserList, setSpecialPermissionUserList] = useState(ProjectStore.usersWithSpecialPermission);
    const [userListForRender, setUserListForRender] = useState([]);

    //Modal helper states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState(handleRemoveSpecialPermission);
    //Error handling state
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setUserListForRender(specialPermissionUserList.map((userToDisplay) => {
            return (
                <MemberDisplay
                    variant={userToDisplay.userId === selectedUser.userId ? 'secondary' : 'outline-dark'}
                    onClick={() => {
                        if (selectedUser === userToDisplay) {
                            setSelectedUser([]);
                        } else {
                            setSelectedUser(userToDisplay);
                        }
                    }}
                    key={userToDisplay.userId}
                    id={userToDisplay.userId}
                    memberfirstname={userToDisplay.firstName}
                    memberlastname={userToDisplay.lastName}
                    memberemail={userToDisplay.email}
                />
            )
        }));
    }, [selectedUser, specialPermissionUserList]);

    async function handleRemoveSpecialPermission() {
        if (selectedUser.email) {
            setIsLoading(true);
            let result = await PutRevokeSpecialPermission(ProjectStore.projectId, selectedUser.email)
            switch (result.status) {
                // 200 - OK
                case 200:
                    setErrorMessage("");
                    await updateProject(ProjectStore.projectId);
                    break;
                // 400 - Bad request
                case  400:
                    setErrorMessage("User is already a member!")
                    break;
                // 403 - Forbidden
                case 403:
                    setErrorMessage("User does not have the permission to be added as a member!")
                    break;
                // 404 - Not found
                case 404:
                    setErrorMessage("A user with that email does not exist!")
                    break;
                case 409:
                    setErrorMessage("That user has already had their permissions revoked!")
                    break;
                default:
                    setErrorMessage("ERROR!")
                    break;
            }
            setIsLoading(false);
        }
    }

    async function openRevokeModal(projectId, emailOfUser) {
        setIsModalOpen(true);
        setModalText("Remove " + selectedUser.firstName + " " + selectedUser.lastName + " from this project?");
        setFunctionIfConfirmed(() => handleRemoveSpecialPermission);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    async function handleGrantSpecialPermission(projectId, emailOfUser) {
        if (emailOfUser) {
            setIsLoading(true);
            let result = await PutGrantSpecialPermission(projectId, emailOfUser)
            switch (result.status) {
                    // 200 - OK
                case 200:
                    setErrorMessage("");
                    await updateProject(projectId);
                    break;
                    // 400 - Bad request
                case  400:
                    setErrorMessage("User is already a member!")
                    break;
                    // 403 - Forbidden
                case 403:
                    setErrorMessage("User does not have the permission to be added as a member!")
                    break;
                    // 404 - Not found
                case 404:
                    setErrorMessage("A user with that email does not exist!")
                    break;
                case 409:
                    setErrorMessage("A user with that email already has special permissions!")
                    break;
                default:
                    setErrorMessage("ERROR!")
                    break;
            }
            setIsLoading(false);
        }
    }

    async function updateProject(projectId) {
        let project = await GetProject(projectId);
        ProjectStore.usersWithSpecialPermission = project.usersWithSpecialPermission;
        setSpecialPermissionUserList(project.usersWithSpecialPermission);
        setSelectedUser([]);
        setEmailOfUserToGrant("");
        setIsLoading(false);
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
                  <h2>Special permissions</h2>
                  <InformationBubble
                  tipHeader="Special permissions"
                  tipParagraph="A user with special permission can see and download files from the project"
                  textToHoverOver="?"
              />
          </div>
          <div className="tabContent tabContentSpecialPermission">
              <Form.Group size="lg" controlId="projectDescription" className="addMemberField">
                  <Form.Label className="addMemberLabel">Grant permission</Form.Label>
                  <div className="formInputAndButton">
                      <Form.Control
                          className="grantSpecialPermissionInput"
                          type="email"
                          name="Grant special permission"
                          placeholder="Enter email"
                          disabled={isLoading || !props.canEditSpecialPermission}
                          value={emailOfUserToGrant}
                          onChange={(e) => setEmailOfUserToGrant(e.target.value)}
                      />
                      <LoaderButton
                          className="addMemberButton"
                          size="sm"
                          type="submit"
                          isLoading={isLoading}
                          disabled={isLoading || !props.canEditSpecialPermission || emailOfUserToGrant.length < 1}
                          onClick={() => {handleGrantSpecialPermission(ProjectStore.projectId, emailOfUserToGrant)}}
                      >
                          Grant permission
                      </LoaderButton>
                  </div>
                  <span className="errorMessage">{errorMessage}</span>
              </Form.Group>
              <div className="memberList">
                  {userListForRender}
              </div>
              <LoaderButton
                  className="removeSpecialPermissionButton"
                  size="sm"
                  variant="outline-danger"
                  isLoading={isLoading}
                  disabled={isLoading || !props.canEditSpecialPermission || !selectedUser.email}
                  onClick={() => {
                      openRevokeModal(ProjectStore.projectId, selectedUser.email);
                      //handleRemoveSpecialPermission(ProjectStore.projectId, selectedUser.email);
                  }}
              >
                  Remove member
              </LoaderButton>
          </div>
      </div>
  );
}

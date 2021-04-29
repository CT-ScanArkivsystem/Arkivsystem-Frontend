import React, {useState} from "react";
import SideBar from "../components/SideBar";
import LoaderButton from "../components/LoaderButton";
import CreateUser from "../components/AdminTabs/CreateUser";
import FindUser from "../components/AdminTabs/FindUser";
import DeleteUser from "../components/AdminTabs/DeleteUser";
import DeleteTagsPage from "../components/AdminTabs/DeleteTagsPage";
import EditUserPage from "../components/AdminTabs/EditUserPage";
import AdminWelcomePage from "../components/AdminWelcomePage";
import ServerRestart from "../components/AdminTabs/ServerRestart";

export default function AdminPage() {

    const [pageContent, setPageContent] = useState(<AdminWelcomePage/>);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState('')


    function contentToCreateUser() {
        setPageContent(<CreateUser/>)
        setCurrentPage("createUser")
    }

    function contentToEditUser() {
        setPageContent(<EditUserPage/>)
        setCurrentPage("editUser")
    }

    function contentToDeleteUser() {
        setPageContent(<DeleteUser/>)
        setCurrentPage("deleteUser")
    }

    function contentToDeleteTags() {
        setPageContent(<DeleteTagsPage/>)
        setCurrentPage("deleteTags")
    }

    function contentToServerRestart() {
        setPageContent(<ServerRestart/>)
        setCurrentPage("serverRestart")
    }

    return (
        <div className="pageContainer">
            <SideBar>
                <h3>Options</h3>
                <LoaderButton
                    className="sideBarButton noHighlight"
                    onClick={contentToCreateUser}
                    isLoading={isLoading}
                    variant={currentPage === "createUser" ? 'secondary' : 'outline-dark'}
                >
                    New User
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton noHighlight"
                    onClick={contentToEditUser}
                    isLoading={isLoading}
                    variant={currentPage === "editUser" ? 'secondary' : 'outline-dark'}
                >
                    Edit User
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton noHighlight"
                    onClick={contentToDeleteUser}
                    isLoading={isLoading}
                    variant={currentPage === "deleteUser" ? 'secondary' : 'outline-dark'}
                >
                    Delete User
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton noHighlight"
                    onClick={contentToDeleteTags}
                    isLoading={isLoading}
                    variant={currentPage === "deleteTags" ? 'secondary' : 'outline-dark'}
                >
                    Delete Tags
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton noHighlight"
                    onClick={contentToServerRestart}
                    isLoading={isLoading}
                    variant={currentPage === "serverRestart" ? 'secondary' : 'outline-dark'}
                >
                    Server Restart
                </LoaderButton>
            </SideBar>
            <div className="pageContent">
                {pageContent}
            </div>
        </div>
    );
}

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


    function contentToCreateUser() {
        setPageContent(<CreateUser/>);
    }

    function contentToEditUser() {
        setPageContent(<EditUserPage/>)
    }

    function contentToDeleteUser() {
        setPageContent(<DeleteUser/>)
    }

    function contentToDeleteTags() {
        setPageContent(<DeleteTagsPage/>)
    }

    function contentToServerRestart() {
        setPageContent(<ServerRestart/>)
    }

    return (
        <div className="pageContainer">
            <SideBar>
                <h3>Options</h3>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToCreateUser}
                    isLoading={isLoading}
                >
                    New User
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToEditUser}
                    isLoading={isLoading}
                >
                    Edit User
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToDeleteUser}
                    isLoading={isLoading}
                >
                    Delete User
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToDeleteTags}
                    isLoading={isLoading}
                >
                    Delete Tags
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToServerRestart}
                    isLoading={isLoading}
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

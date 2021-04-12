import React, {useState} from "react";
import "./AdminPage.css";
import SideBar from "../components/SideBar";
import LoaderButton from "../components/LoaderButton";
import CreateUser from "../components/AdminTabs/CreateUser";
import EditUser from "../components/AdminTabs/EditUser";
import DeleteUser from "../components/AdminTabs/DeleteUser";
import DeleteTags from "../components/AdminTabs/DeleteTags";

export default function AdminPage() {

    const [pageContent, setPageContent] = useState(<CreateUser/>);
    const [isLoading, setIsLoading] = useState(false);


    function contentToCreateUser() {
        setPageContent(<CreateUser/>);
    }

    function contentToEditUser() {
        setPageContent(<EditUser/>)
    }

    function contentToDeleteUser() {
        setPageContent(<DeleteUser/>)
    }

    function contentToDeleteTags() {
        setPageContent(<DeleteTags/>)
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
            </SideBar>
            <div className="pageContent">
                {pageContent}
            </div>
        </div>
    );
}
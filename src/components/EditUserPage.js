import React, {useState} from "react";
import FindUser from "./AdminTabs/FindUser";
import LoadingPage from "../containers/LoadingPage";
import ProjectDetails from "./ProjectTabs/ProjectDetails";
import UploadToProjectContent from "./UploadToProjectContent";
import EditUser from "./AdminTabs/EditUser";
import UserStore from "../stores/UserStore";

export default function EditUserPage() {

    const [pageContent, setPageContent] = useState(<FindUser/>);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState("empty user string");


    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        contentToFindUser();
    }, []);

    function contentToFindUser() {
        setPageContent(
            <FindUser EditPageEvent3={() => {contentToEditUser()}}/>
        )
    }

    function contentToEditUser() {
        console.log('editUserPage initialisation')
        setPageContent(
            <EditUser backToFindUser={() => {contentToFindUser()}}/>
        )
    }

    return (
        <React.Fragment>
            {pageContent}
        </React.Fragment>

    )


}
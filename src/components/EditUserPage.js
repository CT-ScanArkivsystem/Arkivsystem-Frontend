import React, {useState} from "react";
import FindUser from "./AdminTabs/FindUser";
import LoadingPage from "../containers/LoadingPage";
import ProjectDetails from "./ProjectTabs/ProjectDetails";
import UploadToProjectContent from "./UploadToProjectContent";
import EditUser from "./AdminTabs/EditUser";

export default function EditUserPage() {

    const [pageContent, setPageContent] = useState(<LoadingPage/>);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState("empty user string");


    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        initialisation();
    }, []);

    function initialisation() {
        setPageContent(<FindUser/>);
    }

    function contentToEditUser() {
        setPageContent(<EditUser usertoEdit={user}/>)
    }

    return (
        <React.Fragment>
            {pageContent}
        </React.Fragment>

    )


}
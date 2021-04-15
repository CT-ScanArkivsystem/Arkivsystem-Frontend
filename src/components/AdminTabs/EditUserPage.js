import React, {useState} from "react";
import FindUser from "./FindUser";
import EditUser from "./EditUser";

export default function EditUserPage() {

    const [pageContent, setPageContent] = useState(
        <FindUser
            pageType1="editUser"
            pageTitle="Edit user:"
        />
    );
    const [isLoading, setIsLoading] = useState(false);


    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        contentToFindUser();
    }, []);

    function contentToFindUser() {
        setPageContent(
            <FindUser
                EditPageEvent3={() => {contentToEditUser()}}
                pageType1="editUser"
                pageTitle="Edit user:"
            />
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
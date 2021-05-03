import React, {useState} from "react";
import ProjectStore from "../stores/ProjectStore";
import SideBar from "../components/SideBar";
import ProjectDetails from "../components/ProjectTabs/ProjectDetails";
import ProjectMembers from "../components/ProjectTabs/ProjectMembers";
import ProjectSpecialPermission from "../components/ProjectTabs/ProjectSpecialPermission";
import ProjectFiles from "../components/ProjectTabs/ProjectFiles";
import UploadToProjectContent from "../components/ProjectTabs/UploadToProjectContent";
import LoadingPage from "../containers/LoadingPage";
import UserStore from "../stores/UserStore";
import GetProject from "../apiRequests/GetProject";
import GetAllProjectSubFolders from "../apiRequests/GetAllProjectSubFolders";
import Button from "react-bootstrap/Button";
import {useHistory} from "react-router-dom";

export default function Project() {

    const [pageContent, setPageContent] = useState(<LoadingPage />);
    const [isLoading, setIsLoading] = useState(true);
    const [subFoldersInProject, setSubFoldersInProject] = useState([]);
    const [currentPage, setCurrentPage] = useState("Loading");
    const history = useHistory();

    const projectPages = [
        {
            pageName: "Project details",
            pageElement: <ProjectDetails
                canEdit={checkPermission("member")}
                isOwner={checkPermission("owner")}
            />,
            permissionToView: checkPermission("none")
        },
        {
            pageName: "Upload files",
            pageElement: <UploadToProjectContent
                canUpload={checkPermission("member")}
                projectSubFolders={subFoldersInProject}
            />,
            permissionToView: checkPermission(ProjectStore.isPrivate ? "member" : "member"),
        },
        {
            pageName: "Project files",
            pageElement: <ProjectFiles
                canDownloadFiles={checkPermission("specialPermission")}
                canEditFiles={checkPermission("member")}
                projectSubFolders={subFoldersInProject}
            />,
            permissionToView: checkPermission(ProjectStore.isPrivate ? "specialPermission" : "none")
        },
        {
            pageName: "Project members",
            pageElement: <ProjectMembers
                canEditMembers={checkPermission("owner")}
            />,
            permissionToView: checkPermission("none")
        },
        {
            pageName: "Special Permission",
            pageElement: <ProjectSpecialPermission
                canEditSpecialPermission={checkPermission("member")}
            />,
            permissionToView: checkPermission("none")
        }
    ];


    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        initialisation();
    }, []);

    async function initialisation() {
        // Check if the projectId is present. If it is not send the user to the frontpage.
        if (!ProjectStore.projectId) {
            history.push("/userFrontpage");
        } else {
            let project = await GetProject(ProjectStore.projectId);

            putProjectIntoStore(project);

            setPageContent(<ProjectDetails
                canEdit={checkPermission("member")}
                isOwner={checkPermission("owner")}
                />
            );
            setCurrentPage("Project details")

            if (ProjectStore.isPrivate) {
                if (checkPermission("specialPermission")) {
                    let allProjectSubFolders = await GetAllProjectSubFolders(project.projectId);
                    setSubFoldersInProject(allProjectSubFolders);
                }
            } else {
                let allProjectSubFolders = await GetAllProjectSubFolders(project.projectId);
                setSubFoldersInProject(allProjectSubFolders);
            }

            setIsLoading(false);
        }
    }

    /**
     * This function will set all the information in the project into the store.
     * @param project that the user is currently viewing.
     */
    function putProjectIntoStore(project) {
        ProjectStore.projectId = project.projectId;
        ProjectStore.projectName = project.projectName;
        ProjectStore.projectDescription = project.description;
        ProjectStore.projectOwner = project.owner;
        ProjectStore.isPrivate = project.isPrivate;
        ProjectStore.creationDate = project.creation;
        ProjectStore.projectMembers = project.projectMembers;
        ProjectStore.projectTags = project.tags;
        ProjectStore.usersWithSpecialPermission = project.usersWithSpecialPermission;
    }

    /**
    This function checks if the user meets the permission requirements that is given.
    If the user meets the permission needs they will be allowed to edit the page with said requirement.

    @param permissionNeeded String that contains the permission that is going to be checked.
     */
    function checkPermission(permissionNeeded) {
        let hasPermission = false;

        if (checkIfAdmin(UserStore.role)) {
            hasPermission = true;
        } else {
            switch (permissionNeeded) {
                case 'owner':
                    if (checkIfOwner(ProjectStore.projectOwner.userId, UserStore.userId)) {
                        hasPermission = true;
                    }
                    break;
                case 'member':
                    if (checkIfUserIsInList(ProjectStore.projectMembers, UserStore.userId) || checkIfOwner(ProjectStore.projectOwner.userId, UserStore.userId)) {
                        hasPermission = true;
                    }
                    break;
                case 'specialPermission':
                    if (checkIfUserIsInList(ProjectStore.usersWithSpecialPermission, UserStore.userId) || checkIfOwner(ProjectStore.projectOwner.userId, UserStore.userId) || checkIfUserIsInList(ProjectStore.projectMembers, UserStore.userId)) {
                        hasPermission = true;
                    }
                    break;
                case 'none':
                        hasPermission = true;
                    break
                default:
                    hasPermission = false;
                    break;
            }
        }

        return hasPermission;
    }

    function checkIfAdmin(userRole) {
        return userRole === "ROLE_ADMIN";
    }

    function checkIfOwner(ownerId, userId) {
        return ownerId === userId;
    }

    function checkIfUserIsInList(memberList, userId) {
        let isUserInList = false;
        for (let i = 0; memberList.length > i && isUserInList !== true; i++) {
            if (memberList[i].userId === userId) {
                isUserInList = true;
            }
        }
        return isUserInList;
    }

    function createSideBarButtons() {
        let result = [];

        result = projectPages.map((page) => {
            return(
                <Button
                    className="sideBarButton noHighlight"
                    key={page.pageName}
                    variant={currentPage === page.pageName ? 'secondary' : 'outline-dark'}
                    disabled={isLoading || !page.permissionToView}
                    onClick={() => {
                        if (currentPage !== page.pageName) {
                            setPageContent(page.pageElement);
                            setCurrentPage(page.pageName);
                        }
                    }}
                >
                    {page.pageName}
                </Button>
            )
        })

        return result;
    }

    return (
        <div className="CreateProject pageContainer">
            <SideBar>
                <h3>Options</h3>
                {createSideBarButtons()}
            </SideBar>
            <div className="pageContent">
                {pageContent}
            </div>
        </div>
    );
}

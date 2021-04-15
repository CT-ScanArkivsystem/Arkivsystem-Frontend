import React, {useEffect, useState} from "react";
import "./Project.css";
import ProjectStore from "../stores/ProjectStore";
import SideBar from "../components/SideBar";
import LoaderButton from "../components/LoaderButton";
import ProjectDetails from "../components/ProjectTabs/ProjectDetails";
import ProjectImages from "../components/ProjectTabs/ProjectImages";
import ProjectMembers from "../components/ProjectTabs/ProjectMembers";
import ProjectSpecialPermission from "../components/ProjectTabs/ProjectSpecialPermission";
import ProjectFiles from "../components/ProjectTabs/ProjectFiles";
import UploadToProjectContent from "../components/ProjectTabs/UploadToProjectContent";
import LoadingPage from "../containers/LoadingPage";
import UserStore from "../stores/UserStore";
import GetProject from "../apiRequests/GetProject";
import GetAllTags from "../apiRequests/GetAllTags";
import GetAllFileNames from "../apiRequests/GetAllFileNames";
import GetAllProjectSubFolders from "../apiRequests/GetAllProjectSubFolders";

export default function Project() {

    const [pageContent, setPageContent] = useState(<LoadingPage />);
    const [isLoading, setIsLoading] = useState(false);
    const [projectTags, setProjectTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [subFoldersInProject, setSubFoldersInProject] = useState([]);
    const [filesInProject, setFilesInProject] = useState([]);
    const [currentPage, setCurrentPage] = useState("Loading");

    const projectPages = [
        {
            pageName: "Project details",
            pageElement: <ProjectDetails
                canEdit={checkPermission("member")}
                projectTags={projectTags}
                allTags={allTags} />
        },
        {
            pageName: "Upload files",
            pageElement: <UploadToProjectContent
                projectSubFolders={subFoldersInProject}
            />
        },
        {
            pageName: "Project images",
            pageElement: <ProjectImages />
        },
        {
            pageName: "Project files",
            pageElement: <ProjectFiles
                canDownloadFiles={checkPermission("specialPermission")}
                canEditFiles={checkPermission("member")}
                projectSubFolders={subFoldersInProject}
            />
        },
        {
            pageName: "Project members",
            pageElement: <ProjectMembers
                canEditMembers={checkPermission("owner")}
            />
        },
        {
            pageName: "Special Permission",
            pageElement: <ProjectSpecialPermission />
        }
    ];


    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        initialisation();
    }, []);

    async function initialisation() {
        let project = await GetProject(ProjectStore.projectId);

        let tagsInProject = trimTagArray(project.tags, project.tags);
        setProjectTags(tagsInProject);

        let allTagsTrimmed = trimTagArray(await GetAllTags(), project.tags);
        setAllTags(allTagsTrimmed);
        setPageContent(<ProjectDetails canEdit={checkPermission("member")} projectTags={tagsInProject} allTags={allTagsTrimmed} />);
        setCurrentPage("Project details")

        let allProjectSubFolders = await GetAllProjectSubFolders(project.projectId);
        setSubFoldersInProject(allProjectSubFolders);
        console.log(allProjectSubFolders);

        //let allFilesInProject = await GetAllFileNames("all", project.projectId, "mySubFolder");
        //setFilesInProject(allFilesInProject);

        //let allFilesInProject = GetAllFileNames(ProjectStore.projectId);
    }

    /**
     * This function removes the unnecessary numberOfProjects part of the tags that is gotten from the requests.
     * The function also calls to check if the tags are in the project and sets a variable that tells the site if it is in or not.
     *
     * @param arrayToTrim Array which contains tags and numberOfProjects the tags are in.
     * @param projectTagArray The array of the project to check if the tags are in both.
     * @returns *[] trimmedProjectTags The array with trimmed out numberOfProjects and has a new isInProject.
     */
    function trimTagArray(arrayToTrim, projectTagArray) {
        let trimmedProjectTags = [];
        if (arrayToTrim) {
            for (let i = 0; i < arrayToTrim.length; i++) {
                trimmedProjectTags.push({tagName: arrayToTrim[i].tagName, isInProject: checkIfTagIsInProject(arrayToTrim[i].tagName, projectTagArray)});
            }
        }
        return trimmedProjectTags;
    }

    /**
     * This function checks if a tag is in the project.
     *
     * @param tagToCheck The tag that should be checked if is in project.
     * @param projectTagArray The array that contains all the tags in the project.
     * @returns {boolean} isTagInProject returns true if the tag is in the project, else false.
     */
    function checkIfTagIsInProject(tagToCheck, projectTagArray) {
        let isTagInProject = false;
        if (projectTagArray && projectTagArray.length > 0) {
            for (let i = 0; i < projectTagArray.length && isTagInProject === false; i++) {
                if (tagToCheck === projectTagArray[i].tagName) {
                    isTagInProject = true;
                }
            }
        }
        return isTagInProject;
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
                case 'member':
                    if (checkIfUserIsInList(ProjectStore.projectMembers, UserStore.userId)) {
                        hasPermission = true;
                    }
                    break;
                case 'owner':
                    if (checkIfOwner(ProjectStore.projectOwner.userId, UserStore.userId)) {
                        hasPermission = true;
                    }
                    break;
                case 'specialPermission':
                    if (checkIfUserIsInList(ProjectStore.usersWithSpecialPermission, UserStore.userId)) {
                        hasPermission = true;
                    }
                    break;
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
            return(<LoaderButton
                className="sideBarButton"
                key={page.pageName}
                variant={currentPage === page.pageName ? 'secondary' : 'outline-dark'}
                onClick={() => {
                    setPageContent(page.pageElement)
                    if (currentPage === page.pageName) {
                        setCurrentPage("");
                    } else {
                        setCurrentPage(page.pageName);
                    }
                }}
                isLoading={isLoading}
            >
                {page.pageName}
            </LoaderButton>
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
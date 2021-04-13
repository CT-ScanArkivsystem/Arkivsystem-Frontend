import React, {useEffect, useState} from "react";
import "./Project.css";
import ProjectStore from "../stores/ProjectStore";
import SideBar from "../components/SideBar";
import LoaderButton from "../components/LoaderButton";
import {Link} from "react-router-dom";
import ProjectDetails from "../components/ProjectTabs/ProjectDetails";
import ProjectImages from "../components/ProjectTabs/ProjectImages";
import ProjectMembers from "../components/ProjectTabs/ProjectMembers";
import ProjectSpecialPermission from "../components/ProjectTabs/ProjectSpecialPermission";
import ProjectFiles from "../components/ProjectTabs/ProjectFiles";
import UploadToProjectContent from "../components/UploadToProjectContent";
import LoadingPage from "../containers/LoadingPage";
import UserStore from "../stores/UserStore";
import GetProject from "../apiRequests/GetProject";
import GetAllTags from "../apiRequests/GetAllTags";

export default function Project() {

    const [pageContent, setPageContent] = useState(<LoadingPage />);
    const [isLoading, setIsLoading] = useState(false);
    const [projectTags, setProjectTags] = useState([]);
    const [allTags, setAllTags] = useState([]);

    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        initialisation();
    }, []);

    async function initialisation() {
        let project = await GetProject(ProjectStore.projectId);
        console.log(project)

        let tagsInProject = trimTagArray(project.tags, project.tags);
        setProjectTags(tagsInProject);

        let allTagsTrimmed = trimTagArray(await GetAllTags(), project.tags);
        setAllTags(allTagsTrimmed);
        setPageContent(<ProjectDetails canEdit={checkIfCanEdit("member")} projectTags={tagsInProject} allTags={allTagsTrimmed} />);
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
    function checkIfCanEdit(permissionNeeded) {
        let canEdit = false;

        if (checkIfAdmin(UserStore.role)) {
            canEdit = true;
        } else {

            switch (permissionNeeded) {
                case 'member':
                    if (checkIfMember(ProjectStore.projectMembers, UserStore.userId)) {
                        canEdit = true;
                    }
                    break;
                case 'owner':
                    if (checkIfOwner(ProjectStore.projectOwner.userId, UserStore.userId)) {
                        canEdit = true;
                    }
                    break;
                case 'specialPermission':
                    if (checkIfSpecialPermission()) {
                        canEdit = true;
                    }
                    break;
                default:
                    canEdit = false;
                    break;
            }
        }

        return canEdit;
    }

    function checkIfAdmin(userRole) {
        return userRole === "ROLE_ADMIN";
    }

    function checkIfOwner(ownerId, userId) {
        return ownerId === userId;
    }

    function checkIfMember(memberList, userId) {
        let isUserMember = false;
        for (let i = 0; memberList.length > i && isUserMember !== true; i++) {
            if (memberList[i].userId === userId) {
                isUserMember = true;
            }
        }
        return isUserMember;
    }

    function checkIfSpecialPermission() {

    }



    function contentToProjectDetails() {
        setPageContent(<ProjectDetails canEdit={checkIfCanEdit("member")} projectTags={projectTags} allTags={allTags} />);
    }
    function contentToUploadToProject() {
        setPageContent(<UploadToProjectContent />)
    }
    function contentToProjectImages() {
        setPageContent(<ProjectImages />)
    }
    function contentToProjectFiles() {
        setPageContent(<ProjectFiles />)
    }
    function contentToProjectMembers() {
        setPageContent(<ProjectMembers canEditMembers={checkIfCanEdit("owner")} />)
    }
    function contentToProjectSpecialPermission() {
        setPageContent(<ProjectSpecialPermission />)
    }

    return (
        <div className="CreateProject pageContainer">
            <SideBar>
                <h3>Options</h3>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToProjectDetails}
                    isLoading={isLoading}
                >
                    Project details
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToUploadToProject}
                    isLoading={isLoading}
                >
                    Upload files
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToProjectImages}
                    isLoading={isLoading}
                >
                    Project Images
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToProjectFiles}
                    isLoading={isLoading}
                >
                    Project Files
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToProjectMembers}
                    isLoading={isLoading}
                >
                    Project Members
                </LoaderButton>
                <LoaderButton
                    className="sideBarButton"
                    onClick={contentToProjectSpecialPermission}
                    isLoading={isLoading}
                >
                    Special Permission
                </LoaderButton>
                <br/>
                <Link to="/project">
                    <LoaderButton
                        size="bg"
                        className="toProjectButton"
                        isLoading={isLoading}
                        onClick={() => setIsLoading(true)}
                    >
                        Go to project
                    </LoaderButton>
                </Link>
            </SideBar>
            <div className="pageContent">
                {pageContent}
            </div>
        </div>
    );
}
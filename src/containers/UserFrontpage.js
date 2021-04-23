import React, {useEffect, useState} from "react";
import "./UserFrontpage.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import {Link} from "react-router-dom";
import ProjectDisplay from "../components/filesAndProjects/ProjectDisplay";
import GetAllProjects from "../apiRequests/GetAllProjects";
import GetAllTags from "../apiRequests/GetAllTags";
import GetSearchForProjects from "../apiRequests/GetSearchForProjects";
import {onError} from "../libs/errorLib";
import TagDisplay from "../components/TagDisplay";
import SideBar from "../components/SideBar";
import LoadingPage from "./LoadingPage";
import {Dropdown} from "react-bootstrap";

export default function UserFrontpage() {
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [doesHaveProjects, setDoesHaveProjects] = useState(false);
    const [doesHaveTags, setDoesHaveTags] = useState(false);
    const [checkedTags, setCheckedTags] = useState([]);

    const [projectsToDisplay, setProjectsToDisplay] = useState([]);
    const [projectDisplay, setProjectDisplay] = useState([]);

    const [didSearch, setDidSearch] = useState(false);
    const [sortBy, setSortBy] = useState("none");
    const [sortByUserText, setSortByUserText] = useState("None");

    const [allTags, setAllTags] = useState([]);

    //Functions in the React.useEffect() will be run once on load of site.
    React.useEffect(() => {
        initialisation();
    }, []);

    async function initialisation() {
        await initGetAllProjects();
        await initGetAllTags();
        setIsLoading(false);
    }

    /**
     * Gets run once at page load. Calls the GetAllProjects request and stores all the projects in the allProjects Hook.
     * @returns {Promise<void>}
     */
    async function initGetAllProjects() {
        try {
            if (!doesHaveProjects) {
                let tempAllProjects = await GetAllProjects();
                if (tempAllProjects.ok) {
                    setProjectsToDisplay(await tempAllProjects.json());
                    setDoesHaveProjects(true);
                }
            }
        }
        catch (e) {
            onError(e);
        }
    }

    async function initGetAllTags() {
        try {
            if (!doesHaveTags) {
                let tempAllTags = await GetAllTags();
                if (tempAllTags.length > 0) {
                    setAllTags(tempAllTags);
                    setDoesHaveTags(true);
                }
            }
        }
        catch (e) {
            onError(e)
        }
    }

    /**
     * Renders the next Projects as ProjectDisplays onto the page.
     * @param projectList the list of projects that will be the starting point for what we render.
     * @param currentSortBy the string that decides what the projects will be sorted by.
     * @returns {[]} An array of ProjectDisplays
     */
    function renderProjectDisplay(projectList, currentSortBy) {
        let result = [];

        let sortedList = sortProjectList(projectList, currentSortBy);

        if (sortedList) {
            result = sortedList.map((project) => {
                return(
                    <ProjectDisplay
                        className="projectDisplay"
                        key={project.projectId}
                        projectId={project.projectId}
                        projectName={project.projectName}
                        projectOwner={project.owner}
                        projectOwnerName={project.ownerName}
                        projectIsPrivate={project.isPrivate}
                        projectResultInfo={project.resultInfo}
                    />
                );
            })
        }

        return result;
    }

    function sortProjectList(projectList, currentSortBy) {
        let result = [];

        if (didSearch && currentSortBy !== "none") {
            result = projectList.filter(project => project.resultInfo.some(info => info === currentSortBy))
        } else {
            result = projectList;
        }

        return result;
    }

    /**
     * Renders all the tags in the sidebar as TagDisplays.
     * @returns {[]}
     */
    function renderAllTags() {
        let result = [];

        result = allTags.map(function(tagToDisplay) {
            return (
                <TagDisplay
                key={"TagName" + tagToDisplay.tagName}
                id={"TagName" + tagToDisplay.tagName}
                label={tagToDisplay.tagName + " (" + tagToDisplay.numberOfProjects + ")"}
                value={tagToDisplay.tagName}
                onClick={() => toggleTagInList(tagToDisplay)}
            />
            )
        });

        return result;
    }

    /**
     * If the file provided is in the filesToDownload list it will remove it.
     * If the file is not in the list, it will be added.
     * @param tag that is to be added or removed.
     */
    function toggleTagInList(tag) {
        if (checkedTags.indexOf(tag.tagName) !== -1) {
            let tempArray = [...checkedTags];
            let indexToRemove = tempArray.indexOf(tag.tagName);
            tempArray.splice(indexToRemove, 1);
            setCheckedTags(tempArray);
        }
        else {
            setCheckedTags(checkedTags.concat([tag.tagName]));
        }
    }

    function getSortByUserText(currentSortBy) {
        let sortByUserText = "";
        switch (currentSortBy) {
            case "none":
                sortByUserText = "None";
                break;
            case "name":
                sortByUserText = "Project name";
                break;
            case "description":
                sortByUserText = "Project description";
                break;
            case "owner":
                sortByUserText = "Project owner";
                break;
            case "member":
                sortByUserText = "Project members";
                break;
            case "project_Tag":
                sortByUserText = "Project tags";
                break;
            case "file_tag":
                sortByUserText = "File tags";
                break;
            default:
                break;
        }
        return sortByUserText;
    }

    /**
     * When the user clicks the search button and searches for projects
     * @param event holds the information in the forms when the submit button was pressed.
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        event.preventDefault();
        let gotFromSearch;
        setIsLoading(true);
        let res;

        if (searchInput === "" && checkedTags.length < 1) {
            res = await GetAllProjects();
            gotFromSearch = false;
        } else {
            res = await GetSearchForProjects(searchInput, checkedTags);
            gotFromSearch = true;
        }
        let result;

        switch (res.status) {
            case 200:
                result = await res.json();
                setProjectsToDisplay(result);
                if (gotFromSearch) {
                    setDidSearch(true);
                } else {
                    setDidSearch(false);
                }
                break;
            case 204:
                result = [];
                setProjectsToDisplay(result);
                if (gotFromSearch) {
                    setDidSearch(true);
                }
                break;
            case 400:
                console.log("Bad request in GetSearchForProjects");
                break;
            case 500:
                console.log("An unknown error occurred! 500");
                break;
            default:
                console.log("Unknown status code!")
                break;
        }
        setIsLoading(false);
        return result;
    }

    function validateForm() {
        return true;
        // TODO: Validate when you know how to validate
        //return email.length > 0 && password.length > 0;
    }

    return (
        <div className="userFrontpage pageContainer">
            <SideBar>
                <Form onSubmit={handleSubmit}>
                    <Form.Group size="lg">
                        <Form.Control
                            className="searchFormControl"
                            type="search"
                            placeholder="Search"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </Form.Group>
                    <LoaderButton
                        block
                        size="sm"
                        type="submit"
                        isLoading={isLoading}
                        disabled={!validateForm()}
                    >
                        Search
                    </LoaderButton>
                    <Form.Group className="dropdown">
                        <Dropdown className="test">
                            <Dropdown.Toggle size="sm" variant="outline-dark" className="dropdownButton">
                                Sort by: {getSortByUserText(sortBy)}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onSelect={() => setSortBy("name")}>Project name</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setSortBy("description")}>Project description</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setSortBy("owner")}>Project owner</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setSortBy("member")}>Project members</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setSortBy("project_Tag")}>Project tags</Dropdown.Item>
                                <Dropdown.Item onSelect={() => setSortBy("file_tag")}>File tags</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onSelect={() => setSortBy("none")}>None</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    <Form.Group className="checkboxContainer">
                        {renderAllTags()}
                    </Form.Group>
                </Form>
            </SideBar>
                <div className="frontPageContainer pageContent">
                    <div className="projectContainer">
                        {isLoading ? <LoadingPage/> :
                        <div className="projects">
                            {renderProjectDisplay(projectsToDisplay, sortBy)}
                        </div>
                        }
                    </div>
                    <div className="containerFooter">
                        <Link to="/createProject">
                            <LoaderButton
                                variant="dark"
                                isLoading={isLoading}
                                className="createProjectButton"
                            >
                                New project
                            </LoaderButton>
                        </Link>
                    </div>
                </div>
                </div>
    );
}

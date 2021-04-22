import React, { useState } from "react";
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

export default function UserFrontpage() {
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [doesHaveProjects, setDoesHaveProjects] = useState(false);
    const [doesHaveTags, setDoesHaveTags] = useState(false);
    const [checkedTags, setCheckedTags] = useState([]);

    const [allProjects, setAllProjects] = useState([]);
    const [projectsToDisplay, setProjectsToDisplay] = useState([])

    const [allTags, setAllTags] = useState([]);

    const [maxFiles, setMaxFiles] = useState(10);

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
                if (tempAllProjects.length > 0) {
                    setAllProjects(tempAllProjects);
                    setProjectsToDisplay(tempAllProjects);
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
                setAllTags(await GetAllTags());
                if (allTags.length > 0) {
                    setDoesHaveTags(true);
                }
            }
        }
        catch (e) {
            onError(e)
        }
    }

    /**
     * Sets a new maxFiles value to increase the number of FileDisplays on the page.
     * Also starts the generating of new FileDisplays.
     */
    function changeMaxFiles() {
        setMaxFiles(maxFiles + 5);
    }

    /**
     * Renders the next Projects as ProjectDisplays onto the page.
     * @param max decides the max amount of ProjectDisplays that can be shown at one time.
     * @returns {[]} An array of ProjectDisplays
     */
    function renderFileDisplays(max) {
        let result = [];

        if (projectsToDisplay) {
            result = projectsToDisplay.map((project) => {
                return(
                    <ProjectDisplay
                        className="projectDisplay"
                        key={project.projectId}
                        projectId={project.projectId}
                        projectName={project.projectName}
                        projectOwner={project.owner}
                        projectOwnerName={project.ownerName}
                        projectIsPrivate={project.isPrivate}
                    />
                );
            })
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

    /**
     * When the user clicks the search button and searches for projects
     * @param event holds the information in the forms when the submit button was pressed.
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        event.preventDefault();

        let res = await GetSearchForProjects(searchInput, checkedTags);
        let result;

        switch (res.status) {
            case 200:
                result = await res.json();
                console.log(result)
                setProjectsToDisplay(result);
                break;
            case 204:
                result = [];
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



        return result;
    }

    function validateForm() {
        return true;
        // TODO: Validate when you know how to validate
        //return email.length > 0 && password.length > 0;
    }
    return (
        !isLoading && (
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
                    <Form.Group size="lg" className="checkboxContainer">
                        {renderAllTags()}
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
                </Form>
            </SideBar>
            <div className="frontPageContainer pageContent">
                <div className="projectContainer">
                    <div className="projects">
                        {renderFileDisplays(maxFiles)}
                    </div>
                </div>
                <div className="containerFooter">
                    <Link to="/createProject">
                        <LoaderButton
                            size="sm"
                            variant="dark"
                            isLoading={isLoading}
                        >
                            New project
                        </LoaderButton>
                    </Link>
                    <LoaderButton
                        size="sm"
                        variant="dark"
                        isLoading={isLoading}
                        onClick={changeMaxFiles}
                    >
                        Get next projects
                    </LoaderButton>
                </div>
            </div>
        </div>
        )
    );
}

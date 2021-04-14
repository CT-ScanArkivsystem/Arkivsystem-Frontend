import React, { useState } from "react";
import "./UserFrontpage.css";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import {Link} from "react-router-dom";
import FileDisplay from "../components/FileDisplay";
import GetAllProjects from "../apiRequests/GetAllProjects";
import GetAllTags from "../apiRequests/GetAllTags";
import {onError} from "../libs/errorLib";
import TagDisplay from "../components/TagDisplay";
import SideBar from "../components/SideBar";

export default function UserFrontpage() {
    const [searchInput, setSearchInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [doesHaveProjects, setDoesHaveProjects] = useState(false);
    const [doesHaveTags, setDoesHaveTags] = useState(false);

    const [allProjects, setAllProjects] = useState([]);

    const [allTags, setAllTags] = useState([]);

    const [filesToDisplay, setFilesToDisplay] = useState([]);
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
     * Renders the next Projects as FileDisplays onto the page.
     * @param max decides the max amount of FileDisplays that can be shown at one time.
     * @returns {[]} An array of FileDisplays
     */
    function renderFileDisplays(max) {
        let result = [];

        if (doesHaveProjects) {
            let i = 0;
            for (i; (i < max) && (i < allProjects.length); i++) {
                result.push(
                    <FileDisplay
                        className="fileDisplay"
                        isproject={true}
                        key={allProjects[i].projectId}
                        fileid={allProjects[i].projectId}
                        filename={allProjects[i].projectName}
                        filedescription={allProjects[i].description}
                        fileowner={allProjects[i].owner}
                        fileisprivate={allProjects[i].isPrivate}
                        filecreationdate={allProjects[i].creation}
                        projectmembers={allProjects[i].projectMembers}
                        userswithspecialpermission={allProjects[i].usersWithSpecialPermission}
                    />
                );
            }
        } else {
            result = ["No projects found!"];
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
                index={tagToDisplay.numberOfProjects}
                value={tagToDisplay.tagName}
            />
            )
        });

        return result;
    }

    /**
     * When the user clicks the search button and searches for projects
     * @param event holds the information in the forms when the submit button was pressed.
     * @returns {Promise<void>}
     */
    async function handleSubmit(event) {
        event.preventDefault();
        console.log("HandleSubmit! in UserFrontpage")
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
                    <h1>Your frontpage!</h1>
                    <div className="projects">
                        {filesToDisplay}
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
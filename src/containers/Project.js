import React from "react";
import "./Project.css";
import ProjectStore from "../stores/ProjectStore";

function getProjectInformation() {
    console.log(ProjectStore.projectId);
    console.log(ProjectStore.projectName);
    console.log(ProjectStore.projectDescription);
    console.log(ProjectStore.projectOwner);
    console.log(ProjectStore.isPrivate);
    console.log(ProjectStore.creationDate);

    return <p>
        {ProjectStore.projectId}<br/>
        {ProjectStore.projectName}<br/>
        {ProjectStore.projectDescription}<br/>
        {ProjectStore.projectOwner}<br/>
        {ProjectStore.isPrivate}<br/>
        {ProjectStore.creationDate}
    </p>;
}

export default function Project() {
    return (
        <div className="test">
            <h3>{getProjectInformation()}</h3>
            <h6>You are on the page Projects!</h6>
        </div>
    );
}
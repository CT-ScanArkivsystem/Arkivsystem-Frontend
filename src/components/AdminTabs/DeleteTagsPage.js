import React, {useState} from "react";
import {onError} from "../../libs/errorLib";
import GetAllTags from "../../apiRequests/GetAllTags";
import TagDisplay from "../TagDisplay";
import ConfirmationModal from "../ConfirmationModal";
import Button from "react-bootstrap/Button";
import DeleteTags from "../../apiRequests/DeleteTags";

export default function DeleteTagsPage() {

    const [isLoading, setIsLoading] = useState(true);

    const [allTags, setAllTags] = useState([]);
    const [doesHaveTags, setDoesHaveTags] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState();

    let elementsToDelete = [];


    React.useEffect(() => {
        //elementsToDelete = []
        initGetAllTags();
    }, []);


    async function initGetAllTags() {
        try {
            if (!doesHaveTags) {
                let tags = await GetAllTags()
                console.log("Raw tags: " + tags)

                let cleanTags = trimTagArray(tags)
                console.log(cleanTags)

                setAllTags(cleanTags)
                if (allTags.length >= 0) {
                    setDoesHaveTags(true)
                    setIsLoading(false)
                }

            }
        } catch (e) {
            onError(e)
        }
    }

    function addTagToSelected(tag) {
        console.log("Adding tag '" + tag.tagName + "' to elementsToDelete")
        elementsToDelete.push(tag)
    }

    function removeTagFromSelected(someTag) {
        console.log("Removing tag '" + someTag.tagName + "' from elementsToDelete")
        elementsToDelete = elementsToDelete.filter(
            tag => {
                return (
                    tag.tagId !== someTag.tagId
                )
            }
        )
    }

    function handleCheck(tagToDisplay) {
        console.log("Clicked tag: " + tagToDisplay.tagName)

        if (!elementsToDelete.some(aTag => aTag.tagName === tagToDisplay.tagName)) {
            console.log("Tag not already in delete list:")
            addTagToSelected(tagToDisplay)
            console.log(elementsToDelete)
        } else {
            console.log("Tag already in delete list")
            removeTagFromSelected(tagToDisplay)
            console.log(elementsToDelete)
        }
    }

    function renderTags() {
        let result = [];

        result = allTags.map(
            function (tagToDisplay) {
                return (
                    <TagDisplay
                        key={"TagKey" + tagToDisplay.tagName}
                        id={"TagId" + tagToDisplay.tagName}
                        label={tagToDisplay.tagName}
                        value={tagToDisplay.tagName}
                        // disabled={!editingTags}
                        // defaultChecked={false}
                        onChange={() => handleCheck(tagToDisplay)}
                    />
                )
            }
        )
        return result;
    }

    function trimTagArray(arrayToTrim) {
        let trimmedProjectTags = [];
        if (arrayToTrim) {
            for (let i = 0; i < arrayToTrim.length; i++) {
                trimmedProjectTags.push({tagId: i, tagName: arrayToTrim[i].tagName});
            }
        }
        return trimmedProjectTags;
    }

    async function handleDeleteTags() {
        console.log("DELETING THE SELECTED TAGS")
        try {
            let wasUserDeleted = await DeleteTags(elementsToDelete)
            if (wasUserDeleted !== null) {
                console.log("API return is not null");
                window.location.reload(false);
            } else {
                console.log("API return is null");
            }
        } catch (e) {
            onError(e);
            //TODO: TELL THE USER SOMETHING WENT WRONG!
        }

    }

    function openModal() {
        setIsModalOpen(true);
        setModalText("Are you sure you want to delete " + elementsToDelete.length + " tags?");
        setFunctionIfConfirmed(() => handleDeleteTags);
    }

    function closeModal() {
        setIsModalOpen(false)
        resetForm()
    }

    function resetForm() {
        let clist = document.getElementsByTagName("input");
        for (let i = 0; i < clist.length; ++i) {
            clist[i].checked = false
        }
    }


    return (
        !isLoading && (
            <div className="deleteTag">
                <div className="tabHeader">
                    <h2>Delete tags:</h2>
                </div>
                <div className="thisPagesContent">
                    <ConfirmationModal
                        functionToCloseModal={closeModal}
                        isOpen={isModalOpen}
                        modalText={modalText}
                        functionIfConfirmed={functionIfConfirmed}
                    />
                    {renderTags()}
                    <Button
                        className="sideBarButton"
                        variant="dark"
                        onClick={() => openModal()}
                        disabled={isLoading}
                    >
                        Delete tags
                    </Button>
                </div>
            </div>
        )
    )
}

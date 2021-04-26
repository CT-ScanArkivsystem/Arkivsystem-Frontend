import React, {useState} from "react";
import {onError} from "../../libs/errorLib";
import GetAllTags from "../../apiRequests/GetAllTags";
import TagDisplay from "../TagDisplay";
import ConfirmationModal from "../ConfirmationModal";
import Button from "react-bootstrap/Button";
import DeleteTags from "../../apiRequests/DeleteTags";
import "./DeleteTagsPage.css"

export default function DeleteTagsPage() {

    const [isLoading, setIsLoading] = useState(true);

    const [allTags, setAllTags] = useState([]);
    const [doesHaveTags, setDoesHaveTags] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState();
    const [testArray, setTestArray] = useState([]);
    const [testArrayIsEmpty, setTestArrayIsEmpty] = useState(true);
    const [buttonEnabled, setButtonEnabled] = useState(false)


    // const [errorText, setErrorText] = useState("No tags selected!");

    let elementsToDelete = [];


    React.useEffect(() => {
        //elementsToDelete = []
/*
        if (testArrayIsEmpty) {
            console.log("if check: array is empty")
            setButtonEnabled(false)
        } else {
            console.log("if check: array is NOT empty")
            setButtonEnabled(true)
        }
        console.log("Empty: " + testArrayIsEmpty)
*/
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
        console.log("Adding tag '" + tag.tagName + "' to testArray state")
        // elementsToDelete.push(tag)
        let tempArray = testArray
        tempArray.push(tag)
        setTestArray(tempArray)

        console.log("Setting: not empty")
        setTestArrayIsEmpty(false)


    }

    function removeTagFromSelected(someTag) {
        console.log("Removing tag '" + someTag.tagName + "' from testArray state")
        let tempArray = testArray

        tempArray = tempArray.filter(
            tag => {
                return (
                    tag.tagId !== someTag.tagId
                )
            }
        )
        setTestArray(tempArray)

        // Print below is always too slow
        console.log("length: " + tempArray.length)
        if (tempArray.length < 1) {
            console.log("Setting: empty")
            setTestArrayIsEmpty(true)
        }
    }

    function handleCheck(tagToDisplay) {
        // Usikker på om .some funker på array state...
        if (!testArray.some(aTag => aTag.tagName === tagToDisplay.tagName)) {
            addTagToSelected(tagToDisplay)
            console.log(testArray)
        } else {
            removeTagFromSelected(tagToDisplay)

            // This is too slow to update
            console.log(testArray)
        }
    }

    function printText() {
        console.log(testArray)
        console.log("Empty: " + testArrayIsEmpty)
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
        // setModalText("Are you sure you want to delete " + elementsToDelete.length + " tags?\n\n" + "This action cannot be undone!");
        setModalText(
            <span>
                Are you sure you want to delete {elementsToDelete.length} tags? <br/><br/>
                This action cannot be undone!
            </span>
        );
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
        setTestArray([])
        setTestArrayIsEmpty(true)
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

                    {/*<p className="errorMessage">{errorText}</p>*/}
                </div>
                <Button
                    className="thisButton"
                    variant="dark"
                    onClick={() => openModal()}
                    disabled={testArrayIsEmpty}
                >
                    Delete tags
                </Button>
                <Button
                    className="thisButton"
                    variant="dark"
                    onClick={() => printText()}
                    disabled={false}
                >
                    Print
                </Button>
            </div>
        )
    )
}

import React, {useState} from "react";
import {onError} from "../../libs/errorLib";
import GetAllTags from "../../apiRequests/GetAllTags";
import TagDisplay from "../TagDisplay";
import ConfirmationModal from "../ConfirmationModal";
import Button from "react-bootstrap/Button";
import DeleteTags from "../../apiRequests/DeleteTags";
import "./DeleteTagsPage.css"
import {Table} from "react-bootstrap";

export default function DeleteTagsPage() {

    const [isLoading, setIsLoading] = useState(true);
    const [allTags, setAllTags] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState();
    const [testArray, setTestArray] = useState([]);
    const [testArrayIsEmpty, setTestArrayIsEmpty] = useState(true);


    React.useEffect(() => {
        initGetAllTags();
    }, []);


    async function initGetAllTags() {
        try {
            let tags = await GetAllTags()
            console.log(tags)

            setAllTags(tags)
            setIsLoading(false)

        } catch (e) {
            onError(e)
        }
    }

    function addTagToSelected(tag) {
        let tempArray = testArray
        tempArray.push(tag)
        setTestArray(tempArray)
        setTestArrayIsEmpty(false)


    }

    function removeTagFromSelected(someTag) {
        let tempArray = testArray

        tempArray = tempArray.filter(
            tag => {
                return (
                    tag.tagName !== someTag.tagName
                )
            }
        )
        setTestArray(tempArray)

        if (tempArray.length < 1) {
            setTestArrayIsEmpty(true)
        }
    }

    function handleCheck(tagToDisplay) {
        if (!testArray.some(aTag => aTag.tagName === tagToDisplay.tagName)) {
            addTagToSelected(tagToDisplay)
        } else {
            removeTagFromSelected(tagToDisplay)
        }
    }

    function renderTags() {
        let result = [];

        result = allTags.map(
            function (tagToDisplay) {
                return (
                    <TagDisplay
                        key={"TagKey" + tagToDisplay.tagName}
                        id={"TagId" + tagToDisplay.tagName} // handleCheck is not called on tag name click if this line is removed
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
        try {
            let wasUserDeleted = await DeleteTags(testArray)
            if (wasUserDeleted !== null) {
                setIsLoading(true)
                initGetAllTags();
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
        setModalText(
            <div>
                Are you sure you want to delete {testArray.length} tags? <br/><br/>
                <Table className="tag-table">
                    <tbody>
                    {listOfTagNumbers()}
                    </tbody>

                </Table><br/>
                This action cannot be undone!
            </div>
        );
        setFunctionIfConfirmed(() => handleDeleteTags);
    }

    function listOfTagNumbers() {
        let result = [];

        result = testArray.map(
            function (thisTag) {
                return (
                    <tr>
                        <td className="toTheLeft">{thisTag.tagName}</td>
                        <td className="tag-details-1 toTheRight">Used in:</td>
                        <td className="tag-details-2 toTheLeft">{thisTag.numberOfProjects} projects</td>
                    </tr>
                )
            }
        )
        return result;

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
                </div>
                <Button
                    className="thisButton"
                    variant="dark"
                    onClick={() => openModal()}
                    disabled={testArrayIsEmpty}
                >
                    Delete tags
                </Button>
            </div>
        )
    )
}

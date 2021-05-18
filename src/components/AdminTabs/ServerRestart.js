import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import "./ServerRestart.css"
import Button from "react-bootstrap/Button";
import ConfirmationModal from "../ConfirmationModal";
import TimePicker from 'react-time-picker';
import TimezoneSelect from 'react-timezone-select'
import RestartServer from "../../apiRequests/RestartServer";
import {onError} from "../../libs/errorLib";

export default function ServerRestart() {

    const [isLoading, setIsLoading] = useState(false)
    const [restartDate, setRestartDate] = useState("")
    const [editedDate, setEditedDate] = useState(false)
    const [restartTime, setRestartTime] = useState("")
    const [editedTime, setEditedTime] = useState(false)
    const [restartZone, setRestartZone] = useState("")
    const [editedZone, setEditedZone] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState();


    async function handleSubmit() {
        try {
            let didSetRestart = await RestartServer(restartDate, restartTime, restartZone)
            if (didSetRestart !== null) {
                window.location.reload();
                // console.log("Not returned null");
            } else {
                console.log("Restart not set");
            }
        } catch (e) {
            onError(e)
        }
    }

    function validateForm() {
        return (
            restartDate !== "" && restartDate !== null && restartTime !== "" && restartTime !== null && restartZone !== "" && restartZone !== null
        )
    }

    function openModal() {
        setIsModalOpen(true);
        setModalText("Are you sure you want to send restart command?");
        setFunctionIfConfirmed(() => handleSubmit);
    }

    function closeModal() {
        setRestartDate("")
        setEditedDate(false)
        setRestartTime("")
        setEditedTime(false)
        setIsModalOpen(false)
    }

    function fixString(string) {
        let startParenthesis = string.indexOf("(")
        let endParenthesis = string.indexOf(")")
        let removedStuff = string.slice(startParenthesis + 4, endParenthesis).replace(":", "")
        if (removedStuff.length === 4) {
            let result = removedStuff.slice(0, 1) + "0" + removedStuff.slice(1)
            return result
        } else {
            return removedStuff
        }
    }

    function displayFormError() {
        let errorMessage = ""

        if ((restartDate === "" || restartDate === null) && editedDate) {
            errorMessage = "Please enter date"
        }
        else if ((restartTime === "" || restartTime === null) && editedTime) {
            errorMessage = "Please enter time"
        }
        else if ((restartZone === "" || restartZone === null) && editedZone) {
            errorMessage = "Please pick time zone"
        }
        return errorMessage

    }

    function handleRestartDate(date) {
        setEditedDate(true)
        setRestartDate(date)
    }

    function handleRestartTime(time) {
        setEditedTime(true)
        setRestartTime(time)
    }

    function handleRestartZone(zone) {
        setEditedZone(true)
        setRestartZone(zone)
    }

    return (
        !isLoading && (
            <div className="serverRestart">
                <div className="tabHeader">
                    <h2>Set time for server restart:</h2>
                </div>
                <div className="tabContent">
                    <ConfirmationModal
                        functionToCloseModal={closeModal}
                        isOpen={isModalOpen}
                        modalText={modalText}
                        functionIfConfirmed={functionIfConfirmed}
                    />
                    <Form className="formContainer">
                        <Form.Group size="lg" controlId="restartDate">
                            <Form.Label>Date:</Form.Label>
                            <Form.Control
                                type="date"
                                value={restartDate}
                                onChange={(e) => handleRestartDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="restartTime" className="put-on-rows">
                            <Form.Label>Time:</Form.Label>
                            <TimePicker
                                className="time-picker-element"
                                value={restartTime}
                                onChange={(e) => handleRestartTime(e)}
                                locale="nb-NO"
                                format="HH:mm"
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="restartZone">
                            <Form.Label>Time zone:</Form.Label>
                            <TimezoneSelect
                                // default={restartZone}
                                value={restartZone}
                                onChange={(e) => handleRestartZone(fixString(e.label))}
                            />
                        </Form.Group>
                        <Button
                            variant="outline-dark"
                            onClick={() => openModal()}
                            disabled={!validateForm()}
                            size="lg"
                        >
                            Submit
                        </Button>
                        <p className="errorMessage">{displayFormError()}</p>
                    </Form>
                </div>
            </div>
        )
    )
}

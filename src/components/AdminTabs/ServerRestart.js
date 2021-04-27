import React, {useState} from "react";
import Form from "react-bootstrap/Form";
import "./ServerRestart.css"
import LoaderButton from "../LoaderButton";
import Button from "react-bootstrap/Button";
import ConfirmationModal from "../ConfirmationModal";
import {Table} from "react-bootstrap";

export default function ServerRestart() {

    const [isLoading, setIsLoading] = useState(false)
    const [restartDate, setRestartDate] = useState("")
    const [restartTime, setRestartTime] = useState("")
    const [restartZone, setRestartZone] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalText, setModalText] = useState("SHOULD NOT SEE THIS!")
    const [functionIfConfirmed, setFunctionIfConfirmed] = useState();



    async function handleSubmit() {
        console.log(restartDate.toString())


    }

    function validateForm() {
        return (
            restartDate !== "" && restartTime !== "" && restartZone !== ""
        )
    }

    function displayFormError() {

    }

    function openModal() {
        setIsModalOpen(true);
        setModalText("Are you sure you want to send restart command?");
        setFunctionIfConfirmed(() => handleSubmit);
    }

    function closeModal() {
        setIsModalOpen(false)
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
                                onChange={(e) => setRestartDate(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="restartTime">
                            <Form.Label>Time:</Form.Label>
                            <Form.Control
                                type="text"
                                value={restartTime}
                                onChange={(e) => setRestartTime(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group size="lg" controlId="restartZone">
                            <Form.Label>Time zone:</Form.Label>
                            <Form.Control
                                type="text"
                                value={restartZone}
                                onChange={(e) => setRestartZone(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="dark"
                            onClick={() => openModal()}
                            disabled={!validateForm()}
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

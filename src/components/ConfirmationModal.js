import React from 'react';
import Modal from 'react-modal';
import Button from "react-bootstrap/Button";
import "./ConfirmationModal.css";

Modal.setAppElement('#root')

export default function ConfirmationModal(props) {
    return (
        <Modal
            className="Modal"
            isOpen={props.isOpen}
            onRequestClose={props.functionToCloseModal}
        >
            <h4>{props.modalText}</h4>
            <div className="modalButtons">
                <Button
                    className="modalButton"
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                        props.functionToCloseModal()
                    }}
                >
                    Cancel
                </Button>
                <Button
                    className="modalButton"
                    variant="outline-success"
                    size="sm"
                    onClick={() => {
                        props.functionIfConfirmed()
                        props.functionToCloseModal()
                    }}
                >
                    Confirm
                </Button>
            </div>
        </Modal>
    )
}
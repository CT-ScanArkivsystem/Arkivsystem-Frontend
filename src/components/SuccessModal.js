import React from 'react';
import Modal from 'react-modal';
import Button from "react-bootstrap/Button";
import "./ConfirmationModal.css";

Modal.setAppElement('#root')

export default function SuccessModal(props) {
    return (
    <Modal
        className="Modal"
        isOpen={props.isOpen}
        onRequestClose={props.functionToCloseModal}
    >
        <h4 className="modalText">{props.modalText}</h4>
        <div className="modalButtons">
            <Button
                className="modalButton"
                variant="outline-success"
                size="sm"
                onClick={() => {
                    props.functionToCloseModal()
                }}
            >
                OK
            </Button>
        </div>
    </Modal>
    )
}

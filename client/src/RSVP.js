import React from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";

function MyVerticallyCenteredModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    RSVP for GDG
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>GDG</h4>
                <p>
                    Monday, March 23, 2020
                    7:00 PM to 9:00 PM
                </p>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Number of Guests
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item>0</Dropdown.Item>
                        <Dropdown.Item>1</Dropdown.Item>
                        <Dropdown.Item>2</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.onSave}>
                    RSVP
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

const RSVP = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [rsvp, setRsvp] = React.useState(false);
    const [guests, setGuests] = React.useState(false);

    const save = () => {
        console.log('Save');
    };

    return (
        <div className="container">
            <Button variant="primary" onClick={() => setModalShow(true)}>
                RSVP
            </Button>

            <MyVerticallyCenteredModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                onSave={() => save()}
            />
        </div>
    );
};

export default RSVP;

import React from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import '../rsvp/rsvp.css';
import {Dropdown, DropdownButton} from "react-bootstrap";
import axios from "axios";

const MyVerticallyCenteredModal = (props) => {

    return (
        <Modal onHide={props.onHide} show={props.show} size="lg" aria-labelledby="contained-modal-title-vcenter"
               centered="centered">
            <Modal.Header closeButton="closeButton">
                <Modal.Title id="contained-modal-title-vcenter">
                    RSVP for {props.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>{props.name}</h4>
                <p>
                    <strong>Location:</strong> {props.address}
                </p>
                <p>
                    <strong>Start Date:</strong> {props.start_date}
                </p>
                <p>
                    <strong>End Date:</strong> {props.end_date}
                </p>
                <p>No of Guests</p>

                <DropdownButton id="dropdown-item-button" onSelect={props.guestsUpdated} title={props.guests}>
                    <Dropdown.Item eventKey="0" as="button">0</Dropdown.Item>
                    <Dropdown.Item eventKey="1" as="button">1</Dropdown.Item>
                    <Dropdown.Item eventKey="2" as="button">2</Dropdown.Item>
                </DropdownButton>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    Close
                </Button>
                <Button variant="success" onClick={props.rsvpClicked}>
                    RSVP
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

class RSVP extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            guest: 0,
            rsvp: false
        };
    }

    guestsUpdated = (e) => {
        this.setState({guest: e});
    };

    componentDidMount() {

        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
        };

        axios.get('/api/user/getuser/' + localStorage.getItem('token'), {
            headers: headers
        })
            .then(res => {
                this.setState({first_name: res.data.firstname});
                this.setState({last_name: res.data.lastname});
                this.setState({user_id: res.data._id});
            });
    }

    saveRsvp = () => {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
        };

        const rsvp = {
            user_id: this.state.user_id,
            event_id: this.props.event_id,
            response: true,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            no_of_guests: this.state.guest
        };

        axios.post('/api/rsvp/confirm/', rsvp, {
            headers: headers
        })
            .then(res => alert(res.data.message));

        this.setState({
            modalShow: false,
            guest: 0,
            rsvp: false
        })
    };

    render() {
        return (
            <div>
                <div className="vertical-center">
                    <Button block variant="primary" onClick={() => this.setState({modalShow: true})}>
                        RSVP
                    </Button>
                </div>

                <MyVerticallyCenteredModal show={this.state.modalShow}
                                           onHide={() => this.setState({modalShow: false})}
                                           rsvpClicked={this.saveRsvp}
                                           event_id={this.state.event_id}
                                           start_date={this.props.start_date}
                                           end_date={this.props.end_date}
                                           address={this.props.address}
                                           name={this.props.name}
                                           guestsUpdated={this.guestsUpdated}
                                           guests={this.state.guest}/>
            </div>
        )
    };
}

export default RSVP;
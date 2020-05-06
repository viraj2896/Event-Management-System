import React, { useState} from 'react';
import { useHistory } from 'react-router-dom';
import './event.css';
import Header from '../header';
import Footer from '../footer';
import {Col, Container, Row, Form, Button} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageUploader from 'react-images-upload';

export default function NewEvent(props) {
    const history = useHistory();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [event_start_date, setEventStartDate] = useState(new Date());
    const [event_end_date, setEventEndDate] = useState(new Date());
    const [location, setLocation] = useState("");
    const [image, setImage] = useState("");

    function handleSubmit(event) {
        console.log(type);
        event.preventDefault();
        const data = new FormData();
        data.append('name', name);
        data.append('description', description);
        data.append('type', type);
        data.append('start_date', event_start_date);
        data.append('end_date', event_end_date);
        data.append('address', location);
        data.append('image', image);
        fetch('/api/event/addevent', {
            method: 'POST',
            body: data,
            headers: {
                'x-auth-token': localStorage.getItem('token')
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(resp => {
                        console.log(resp._id);
                        history.push("/event/" + resp._id);
                    })
                } else {
                    res.json().then(resp => {
                        alert(JSON.stringify(resp.msg));
                    })
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
    }

    return (
        <>
            <Header/>
            <div className='bodyContainer'>
                <Container>
                    <h3>Create New Event</h3>
                    <Row className="AddTopMargin LeftAlign">
                        <Col sm={12} md={{ span: 6, offset: 3 }} className="FormBackground">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="form_event_name" className="AddTopMargin">
                                    <Form.Label>Name</Form.Label><br/>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Event Name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="form_event_description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Event Description"
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="form_event_">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        onChange={(event) => setType(event.target.value)}
                                    >
                                        <option value="Entertainment" selected={type === "Entertainment"}>Entertainment</option>
                                        <option value="Educational" selected={type === "Educational"}>Educational</option>
                                        <option value="Private" selected={type === "Private"}>Private</option>
                                        <option value="Corporate" selected={type === "Corporate"}>Corporate</option>
                                        <option value="Charity" selected={type === "Charity"}>Charity</option>
                                    </Form.Control>
                                </Form.Group>

                                <div>
                                    Event Start Date<br/>
                                    <div className="DateTimePadding">
                                        <DatePicker
                                            selected={event_start_date}
                                            onChange={date => setEventStartDate(date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            timeCaption="time"
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                        />
                                    </div>
                                </div>

                                <div>
                                    Event End Date<br/>
                                    <div className="DateTimePadding">
                                        <DatePicker
                                            selected={event_end_date}
                                            onChange={date => setEventEndDate(date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            timeCaption="time"
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                        />
                                    </div>
                                </div>

                                <div>
                                    Select Image<br/>
                                    <ImageUploader
                                        withIcon={true}
                                        buttonText='Choose images'
                                        onChange={picture => setImage(picture[0])}
                                        imgExtension={['.jpg', '.png']}
                                        maxFileSize={5242880}
                                    />
                                </div>

                                <Form.Group controlId="formBasicPassword2">
                                    <Form.Label>Location</Form.Label><br/>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter location"
                                        value={location}
                                        onChange={(event) => setLocation(event.target.value)}
                                    />
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer/>
        </>
    )
}
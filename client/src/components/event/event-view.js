import React, {useState, useEffect} from 'react';
import './event.css';
import Header from '../header';
import Footer from '../footer';
import MapContainer from "./MapContainer";
import {Card, Col, Container, Row, Form, Button} from "react-bootstrap";
import Comments from "./Comments";
import RSVP from "../rsvp/Rsvp";
import {Link} from "react-router-dom";

export default function Event(props) {
    const [admin, setAdmin] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [address, setAddress] = useState("");
    const [address_latitude, setAddressLatitude] = useState("");
    const [address_logitide, setAddressLongitutde] = useState("");
    const [event_picture, setEventPicture] = useState("");
    const [comments, setComments] = useState([]);
    const { event_id } = props.match.params;

    useEffect(() => {
        fetch('/api/event/' + event_id, {
            method: 'GET'
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(resp => {
                        setAdmin(resp.user_id.firstname + " " + resp.user_id.lastname);
                        setName(resp.name);
                        setDescription(resp.description);
                        setType(resp.type);
                        setAddress(resp.address);
                        setAddressLatitude(resp.address_latitude['$numberDecimal']);
                        setAddressLongitutde(resp.address_longitude['$numberDecimal']);
                        setStartDate(new Date(resp.start_date).toString());
                        setEndDate(new Date(resp.end_date).toString());
                        setComments(resp.comments);
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
    }, []);

    return (
        <>
            <Header/>
            <div className='bodyContainer'>
                <Container>
                    <Row className="AddTopMargin">
                        <Col lg={8} md={12}>
                            <Row>
                                <Col>
                                    <PhotoViewer/>
                                </Col>
                            </Row>
                            <Row className="AddTopMargin">
                                <Col>
                                    <EventDetails description={description}/>
                                </Col>
                            </Row>
                            <Comments comments={comments} event_id={event_id} user_name={admin}/>
                        </Col>
                        <Col lg={4} md={12}>
                            <EventRightSideBar
                                admin={admin}
                                name={name}
                                type={type}
                                address={address}
                                address_latitude={address_latitude}
                                address_logitide={address_logitide}
                                start_date={start_date}
                                end_date={end_date}
                                event_id={event_id}
                                description={description}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer/>
        </>
    )
};

const PhotoViewer = () => {
    return(
        <Card>
            <Card.Img src="https://images.unsplash.com/photo-1584521942371-f42b968e98a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"/>
        </Card>
    )
};

const EventDetails = (props) => {
    return(
        <div>
            <div className="LeftAlign HeadingFont">
                Details
            </div>
            <div className="LeftAlign AddTopMargin NormalFont">
                {props.description}
            </div>
        </div>
    )
};

const EventRightSideBar = (props) => {
    return(
        <Card className="sticky-top">
            <Card.Body className="LeftAlign">
                <Card.Title as="h3" style={{fontWeight: "bold"}}>{props.name}</Card.Title>
                <Card.Text>
                    <span className="far fa-map fa-2x" />
                    &nbsp;&nbsp;&nbsp;{props.address}
                    <br/>
                    &nbsp;&nbsp;
                    <span className="far fa-user fa-2x" />
                    &nbsp;&nbsp;&nbsp;Organized by&nbsp;
                    {props.admin}
                    <br/>
                    &nbsp;&nbsp;<span className="fas fa-calendar-alt fa-2x" />
                    &nbsp;&nbsp;&nbsp;{props.start_date}
                    <br/>
                    &nbsp;&nbsp;<span className="fas fa-calendar-check fa-2x" />
                    &nbsp;&nbsp;&nbsp;{props.end_date}
                    <br/><br/>
                    <Button
                        variant="success"
                        type="submit"
                        href="/payment"
                        block
                    >
                        Make a contribution
                    </Button>
                    <br/>
                    <RSVP event_id={props.event_id} address={props.address} start_date={props.start_date}
                          end_date={props.end_date} name={props.name}/><br/>
                    <Link to={{
                        pathname: '/delegation',
                        query: {
                            event_id: props.event_id
                        }
                    }}> <Button variant="primary">
                        Task Delegation
                    </Button>
                    </Link>&nbsp;&nbsp;
                    <Link to={{
                        pathname: '/invite',
                        query: {
                            event_id: props.event_id,
                            address: props.address,
                            start_date: props.start_date,
                            end_date: props.end_date,
                            event_name: props.name,
                            admin: props.admin,
                            description: props.description
                        }
                    }}> <Button variant="primary">
                        Event Invitation
                    </Button>
                    </Link>
                </Card.Text>
            </Card.Body>
            <MapContainer lat={props.address_latitude} lng={props.address_logitide}/>
        </Card>
    )
};

import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import {Button, Form, FormControl} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Header(props) {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">Event</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/event-create">New Event</Nav.Link>
                <Nav.Link href="/edit-profile">Edit Profile</Nav.Link>
                <Nav.Link href="/updatepassword">Update Password</Nav.Link>
                <Nav.Link href="/payment">Contribute</Nav.Link>
            </Nav>
            <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                <Button variant="outline-info">Search</Button>
            </Form>
        </Navbar>
    )
}
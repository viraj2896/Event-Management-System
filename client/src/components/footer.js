import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Footer(props) {
    return (
            <Navbar className="center-navbar" fixed="bottom" bg="dark" variant="dark">
                <Navbar.Brand href="#home">Event</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/aboutus">About us</Nav.Link>
                    <Nav.Link href="/contactus">Contact</Nav.Link>
                </Nav>
                
            </Navbar>
    )
}
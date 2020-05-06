import React, {useState, useEffect} from 'react';
import './event.css';
import {Card, Col, Container, Row, Form, Button} from "react-bootstrap";


export default function Comments(props) {
    const [new_comment, setNewComment] = useState("");
    const comments = props.comments;
    const event_id = props.event_id;
    const user_name = props.user_name;
    function addComment(event) {
        const data = {
            "event_id": event_id,
            "user_name": user_name,
            "comment": new_comment
        }

        fetch('/api/comment/addcomment', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token')
            }
        })
            .then(res => {
                if (res.status === 200) {
                    window.location.reload(false);
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

    let renderComments;
    console.log(comments.length);
    if(comments.length > 0){
        renderComments = comments.map((item, key) =>
            <Row className="AddTopMargin">
                <Col>
                    <Card>
                        <Card.Body className="LeftAlign">
                            <h5>{item.user_name}</h5>
                            {item.comment}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    } else {
        renderComments = "";
    }

    return(
        <Row className="AddTopMargin AddBottomMargin">
            <Col>
                <Row className="AddTopMargin">
                    <Col>
                        <h3 className="LeftAlign HeadingFont">
                            Comments
                        </h3>
                        <div className="AddTopMargin">
                            <Row>
                                <Col sm={11}>
                                    <Form>
                                        <Form.Group controlId="exampleForm.ControlTextarea1">
                                            <Form.Control
                                                size="lg"
                                                as="textarea"
                                                className="defaultTextBox"
                                                rows="1"
                                                placeholder="Add a comment..."
                                                value={new_comment}
                                                onChange = { (event) => { setNewComment(event.target.value) } }
                                            />
                                        </Form.Group>
                                    </Form>
                                </Col>
                                <Col sm={1}>
                                    <div style={{
                                        cursor:"text",
                                        paddingTop: "20px",
                                        paddingBottom: "20px"}}>
                                        <span onClick={addComment} className="fas fa-paper-plane fa-2x pointer_cursor" />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                {renderComments}
            </Col>
        </Row>
    )
};
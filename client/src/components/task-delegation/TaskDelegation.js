import React from "react";
import axios from "axios";
import Header from "../header";
import Footer from "../footer";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

class TaskDelegation extends React.Component {

    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            task:
                {
                    event_id: '',
                    user_id: '',
                    first_name: '',
                    last_name: '',
                    description: 'Task Description'
                },
            rsvps: [{}]
        };
    }

    componentDidMount() {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
        };

        this.setState({task: {...this.state.task, event_id: this.props.location.query.event_id}});

        axios.get('/api/user/getuser/' + localStorage.getItem('token'), {
            headers: headers
        })
            .then(res => {
                this.setState({
                    task: {
                        ...this.state.task,
                        first_name: res.data.firstname, ...this.state.task,
                        last_name: res.data.lastname, ...this.state.task,
                        user_id: res.data._id
                    }
                });
            });


        axios.get('/api/rsvp/rsvpbyevent/' + this.props.location.query.event_id, {
            headers: headers
        })
            .then(res => this.setState({rsvps: res.data}));

        axios.get('/api/delegation/listdelegation/' + this.props.location.query.event_id)
            .then(res => this.setState({delegations: res.data}));
    }

    handleSubmit(e) {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
        };

        const user = this.state.rsvps.find((rsvp) => rsvp.user_id === this.state.task.user_id);

        const task = {
            user_id: this.state.task.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            event_id: this.state.task.event_id,
            task: this.state.task.description
        };

        axios.post('/api/delegation/adddelegation', task, {
            headers: headers
        })
            .then(res => alert(res.data));

        axios.post('/api/delegation/notifyuser', task, {
            headers: headers
        })
            .then(res => console.log(res.data));

        console.log(this.state.delegations);

        axios.get('/api/delegation/listdelegation/' + this.state.task.event_id)
            .then(res => this.setState({delegations: res.data}));
        
        console.log(this.state.delegations);
    }

    onUserChangeListener(e) {
        this.setState({task: {...this.state.task, user_id: e.target.value}});
    };

    render() {

        let del = this.state.delegations ? this.state.delegations.map((del, index) => (
            <tr>
                <td>{del.first_name}, {del.last_name}</td>
                <td>{del.task}</td>
            </tr>
        )) : null;

        return (
            <>
                <Header/>
                <br/>
                <div className="container">
                    <h1>Delegate New Task</h1>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group controlId="exampleForm.ControlSelect2">
                            <Form.Label>User</Form.Label>
                            <Form.Control as="select" onChange={this.onUserChangeListener.bind(this)}>
                                {this.state.rsvps.map((rsvp, index) => (
                                    <option
                                        value={rsvp.user_id}>{rsvp.first_name}, {rsvp.last_name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Task Description</Form.Label>
                            <Form.Control as="textarea" rows="3" value={this.state.task.description}
                                          onChange={(e) => this.setState({
                                              task: {
                                                  ...this.state.task,
                                                  description: e.target.value
                                              }
                                          })}/>
                        </Form.Group>
                        <Button type="submit">Delegate</Button>
                    </Form>
                    <br/><br/>
                    <h1>Delegated Tasks</h1>
                    <Table bordered hover>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Task</th>
                        </tr>
                        </thead>
                        <tbody>
                        {del}
                        </tbody>
                    </Table>
                    <br/><br/>
                </div>
                <Footer/>
            </>
        );
    }
}

export default TaskDelegation;
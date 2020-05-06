import React from 'react';
import Header from "../header";
import Footer from "../footer";
import axios from 'axios';

class EditProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            phonenumber: '',
            password: '',
            flag: false
        };
    }

    componentDidMount() {
        const headers = {
            'Content-Type': 'application/json',
            'x-auth-token': localStorage.getItem('token')
        };

        axios.get('/api/user/getuser/' + localStorage.getItem('token'), {
            headers: headers
        })
            .then(res => {
                this.setState({
                    _id: res.data._id,
                    username: res.data.username,
                    firstname: res.data.firstname,
                    lastname: res.data.lastname,
                    email: res.data.email,
                    phonenumber: res.data.phonenumber,
                    password: res.data.password
                })
            });
    }

    updateProfileHandler = () => {
        const user = {
            _id: this.state._id,
            username: this.state.username,
            email: this.state.email,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            phonenumber: this.state.phonenumber,
            password: this.state.password
        };

        axios.put('/api/user/update/', user)
            .then(response => {
                if (response.status === 200)
                    alert('Profile Updated');
                else
                    alert('Something went wrong');
            });
    };

    render() {
        return (
            <>
                <Header/>
                <br/>
                <div className="container justify-content-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-lg-offset-4">
                            <h3>Edit Profile</h3>
                            <form className="form-horizontal">
                                <div className="form-group">
                                    <label className="col-md-3 control-label">Username:</label>

                                    <input className="form-control" type="text" value={this.state.username}
                                           onChange={(event) => this.setState({username: event.target.value})}/>

                                </div>
                                <div className="form-group">
                                    <label className="col-lg-3 control-label">First name:</label>

                                    <input className="form-control" type="text" value={this.state.firstname}
                                           onChange={(event) => this.setState({firstname: event.target.value})}/>

                                </div>
                                <div className="form-group">
                                    <label className="col-lg-3 control-label">Last name:</label>

                                    <input className="form-control" type="text" value={this.state.lastname}
                                           onChange={(event) => this.setState({lastname: event.target.value})}/>

                                </div>
                                <div className="form-group">
                                    <label className="col-lg-3 control-label">Email:</label>

                                    <input disabled className="form-control" type="text" value={this.state.email}
                                           onChange={(event) => this.setState({email: event.target.value})}/>

                                </div>
                                <div className="form-group">
                                    <label className="col-lg-3 control-label">Phone:</label>

                                    <input className="form-control" type="text" value={this.state.phonenumber}
                                           onChange={(event) => this.setState({phonenumber: event.target.value})}/>

                                </div>
                                <div className="form-group">

                                    <input type="button" className="btn btn-primary" value="Update"
                                           onClick={this.updateProfileHandler}/>
                                    <input type="reset" className="btn btn-default" value="Cancel"/>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <br/><br/><br/>
                <Footer/>
            </>
        );
    }
}

export default EditProfile;

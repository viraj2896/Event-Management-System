import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Header from '../header';
import Footer from '../footer.js';
import {Redirect} from 'react-router-dom'

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username:'',
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      phonenumber:'',
    }
  }

  renderRedirect = () => {
    if (this.state.successRedirect) {
      return <Redirect to='/sucess' />
    } else {
      return <Redirect to='/failure' />
    }
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    fetch('/api/user/register', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        res.json().then(resp => {
          console.log(resp)
          localStorage.setItem("token", resp.data);
          alert('Registered Successfully!')
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

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div>
        
            <Header/>
        <form onSubmit={this.onSubmit}>
        <h1>Registration</h1>

        <TextField
              hintText="Enter UserName"
              type="name"
              name="username"
              floatingLabelText="User Name"
              value={this.state.username}
              onChange={this.handleInputChange}
              required
            /><br/>
        <TextField
              hintText="Enter FirstName"
              type="name"
              name="firstname"
              floatingLabelText="First Name"
              value={this.state.firstname}
              onChange={this.handleInputChange}
              required
            /><br/>
            <TextField
              hintText="Enter LastName"
              type="name"
              name="lastname"
              floatingLabelText="Last Name"
              value={this.state.lastname}
              onChange={this.handleInputChange}
              required
            /><br/>
            <TextField
              hintText="Enter Email"
              type="email"
              name="email"
              floatingLabelText="Email"
              value={this.state.email}
              onChange={this.handleInputChange}
              required
            /><br/>
            <TextField
              hintText="Enter Password"
              type="password"
              name="password"
              floatingLabelText="Password"
              value={this.state.password}
              onChange={this.handleInputChange}
              required
            /><br/>
            <TextField
              hintText="Enter Phonenumber"
              type="phonenumber"
              name="phonenumber"
              floatingLabelText="Phonenumber"
              value={this.state.phonenumber}
              onChange={this.handleInputChange}
              required
            /><br/>
            <RaisedButton label="Register" type="submit" value="register" primary={true} style={style} onClick={(event) => this.onSubmit(event)} />
          
      </form>
      </div>
      </MuiThemeProvider>
        <Footer/>
      </div>
      
    );
  }
}
const style = {
  margin: 15,
};

import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Header from '../header.js';
import Footer from '../footer.js';  
import { Redirect } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles';

const style = {
    margin: 15,
  };

export default class UpdatePassword extends Component {

  constructor(props) {
    super(props)
    this.state = {
      newPassword: '',
      confirmPassword: ''
    };
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
    if(this.state.newPassword !== this.state.confirmPassword){
        alert('Passwords do not match!');
    }
    console.log('stringify', JSON.stringify({newPassword: this.state.newPassword}))
    fetch('/api/user/updatepassword', {
      method: 'POST',
      body: JSON.stringify({newPassword: this.state.newPassword}),
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => {
      if (res.status === 200) {
          console.log(res)
        res.json().then(resp => {
          console.log(resp);
          alert(resp.message)
          this.props.history.push('/payment');
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
          <Header />
          <br />
          <h1 align="center">Update Password</h1>
          <MuiThemeProvider>
              <form onSubmit={this.onSubmit}>
                  <TextField type="password" hintText="Enter New Password" floatingLabelText="New Password"
                  onChange={(event, newValue) => this.setState({ newPassword: newValue })}/>
                      <br />
                      <TextField type="password" hintText="Confirm Password" floatingLabelText="Confirm Password"
                      onChange={(event, newValue) => this.setState({ confirmPassword: newValue })}/>
                          <br />
                          <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.onSubmit(event)}/>
                          <br />
              </form>
          </MuiThemeProvider>
          <Footer />
      </div>
      )
   } 
};
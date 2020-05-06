import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import  "./login.css";
import Header from '../header.js';
import Footer from '../footer.js';  
import { Redirect } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles';

const style = {
    margin: 15,
  };

export default class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
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
    fetch('/api/user/login', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        res.json().then(resp => {
          console.log(resp)
          localStorage.setItem("token", resp.data);
          this.props.history.push('/event-create');
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
          <h1 align="center">Login</h1>
          <MuiThemeProvider>
              <form onSubmit={this.onSubmit}>
                  <TextField hintText="Enter Email" floatingLabelText="Email"
                  onChange={(event, newValue) => this.setState({ email: newValue })}/>
                      <br />
                      <TextField type="password" hintText="Enter Password" floatingLabelText="Password"
                      onChange={(event, newValue) => this.setState({ password: newValue })}/>
                          <br />
                          <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.onSubmit(event)}/>
                          <br />
                          <a href="/forgetpassword">Forgot Password?</a> 
                          <br />
                          <br />
                          <a href="/register">Not a User? Sign Up!</a>   
              </form>
          </MuiThemeProvider>
          <Footer />
      </div>
      )
   } 
};
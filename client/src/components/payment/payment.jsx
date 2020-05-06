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

export default class Payment extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      amount: '',
      eventId: '',
      link: '',
      userId: '',
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
    fetch('/api/pay/makepayment', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage.getItem('token')
      }
    })
    .then(res => {
      if (res.status === 200) {
        res.json().then(resp => {
          console.log(resp)
          if(resp){
            localStorage.setItem("link",resp.paypalLink);
            localStorage.setItem("userId",resp.userId);
            localStorage.setItem("eventId",resp.eventId);
            localStorage.setItem("amount",resp.amount);
            
            this.props.history.push({
              pathname: '/paypalprocess'
            })
            
          }
        })
      } else {  
        res.json().then(resp => {
          alert(JSON.stringify(resp.msg));
        })
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error');
    });
  }

  render() {
    return (
      <div>
          <Header />
          <br />
          <h1 align="center">Contribute Money</h1>
          <MuiThemeProvider>
              <form onSubmit={this.onSubmit}>
                  <TextField hintText="Enter Name" floatingLabelText="Name"
                  onChange={(event, newValue) => this.setState({ name: newValue })}/>
                      <br />
                      <TextField type="text" hintText="Enter Amount" floatingLabelText="Amount"
                      onChange={(event, newValue) => this.setState({ amount: newValue })}/>
                          <br />
                          <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.onSubmit(event)}/>
              </form>           
          </MuiThemeProvider>
          <Footer />
      </div>
      )
   } 
};
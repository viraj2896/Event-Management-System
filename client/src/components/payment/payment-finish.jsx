import React, { Component } from 'react';
import Header from '../header.js';
import Footer from '../footer.js';  

const style = {
    margin: 15,
  };

export default class PaymentFinish extends Component {

  constructor(props) {
    super(props)
    this.state = {
        resp: ''
    };
  }

  componentDidMount() {
    
    var props = this.props;
    function getUrlParameter(name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(props.location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    var PayerId = encodeURIComponent(getUrlParameter('PayerID'));
    var paymentId = encodeURIComponent(getUrlParameter('paymentId'));

    fetch(`/api/pay/success?PayerID=${PayerId}&paymentId=${paymentId}`, {
      method: 'POST',
      body: JSON.stringify({
        userId: localStorage.getItem('userId'),
        eventId: localStorage.getItem('eventId'),
        amount: localStorage.getItem('amount'),
      }),
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
            console.log(resp);
            this.setState({resp: resp.message}); 
          }
        })
      } else {  
        res.json().then(resp => {
          this.setState({resp: resp.message}); 
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
          <h1 align="center">{this.state.resp}</h1>
          <Footer />
      </div>
      )
   } 
};
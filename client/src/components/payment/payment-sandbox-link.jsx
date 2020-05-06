import React, { Component } from 'react';
import Header from '../header.js';
import Footer from '../footer.js';  

export default class PayPalProcess extends Component {

  constructor(props) {
    super(props)
    console.log('props',props)
    this.state = {
      link: ''
    };
  }
  
  render() {
    return (
      <div>
          <Header />
          <br />
          <h3 align="center">PayPal Link</h3>
          <a href = {localStorage.getItem('link')}>Click the link to finish the transaction.</a>
          <Footer />
      </div>
      )
   } 
};
import React from 'react';
import axios from 'axios';
import Header from '../header';
import Footer from '../footer.js';

import Spinner from 'react-spinkit';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';


class Forgetpassword extends React.Component {
  state = {
    email: '',
    loading: false,
  }

  handleChange = (event) => {
    const { value } = event.target;
    this.setState({
      email: value,
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { email } = this.state;

    this.setState({
      loading: true,
    });

    axios.post('/api/user/forgotpassword', {
      email: email,
    }).then(() => {
      toast.success("Check your email address for the recovery link")
    })
      .catch(() => {
        toast.error("An problem occured, please try again later")
      })
      .finally(() => {
        this.setState({
          loading: false,
        })
      });
  }

  render() {
    const { email, loading } = this.state;

    return (
      <div className="App">
         <Header/>
       
        <section>
          <form onSubmit={this.handleSubmit} className="password-reset" action="">
            <h3>Forgot your password?</h3><br/>
            <label htmlFor="email-input">Enter Email address</label>
            <input type="email" onChange={this.handleChange} value={email} className="email-input" placeholder="name@example.com" id="email-input" name="email" /><br/>
            <button type="submit">Email me a recovery link</button>
            { loading ? <Spinner name='line-scale-pulse-out' /> : null }
          </form>
          <ToastContainer />
        </section>
        <Footer/>
      </div>

    );
  }
}

export default Forgetpassword;
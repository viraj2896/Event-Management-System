import React, { useState} from 'react';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import  "./login.css";
import Header from '../header.js';
import Footer from '../footer.js';
export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    function validateForm() {
      return email.length > 0 && password.length > 0;
    }
  
    function handleSubmit(event) {
      event.preventDefault();
    }
  
    return (
      <>

      <Header/>
    
      <div className="Login">
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <FormLabel >Enter New Password</FormLabel>
            <FormControl
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup controlId="email" bsSize="large">
            <FormLabel >Re-Enter The Password</FormLabel>
            <FormControl
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
            Submit
          </Button>
      
        </form>
      </div>
      <Footer/>
      </>
    );
  }
import React, { Component } from "react";
 
import Header from './header'
import Footer from './footer';
import "./about.css";
class Aboutus extends Component {
  render() {
    return (
      <div>
          <Header/>
        <h2>Event Management Application</h2>
        <p>Our application is aimed at doing multiple tasks which require different applications to do so in just one. Our event management application will do several such tasks such as creating the event, inviting the people in this event, sharing location, creating a sharing pool for both transport and contribution toward the event itself i.e. splitting money share for organizing the event, etc. This way we are hoping that we can do all these different task using our web-based application.
</p>
 <h2>Targeted Audience</h2>
        <p>
Our application will be for everyone whether you are the organizer of the event or the party guest! It will be used by everyone, creator of event, participants, etc.
</p>
        <Footer/>
      </div>
    );
  }
}
 
export default Aboutus;
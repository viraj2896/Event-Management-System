import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Login from './components/login/login';
import Register from './components/register/register';
import RSVP from "./components/rsvp/Rsvp";
import EventInvitation from './components/event-invitation/event-invitation';
import Payment from './components/payment/payment';
import Event from "./components/event/event-view";
import NewEvent from "./components/event/event-create";
import PayPalProcess from './components/payment/payment-sandbox-link'
import PaymentFinish from './components/payment/payment-finish';
import EditProfile from './components/edit-profile/EditProfile';
import Forgetpassword from './components/login/forgetpassword';
import Resetpassword from './components/login/resetpassword';

import EventList from './components/eventlist/eventlist';
import ContactUs from './components/contactus';
import Aboutus from './components/aboutus';
import UpdatePassword from './components/updatepassword/updatepassword';
import TaskDelegation from "./components/task-delegation/TaskDelegation";

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path='/edit-profile' component={EditProfile}/>
                    <Route exact path='/' component={Login}/>
                    <Route path='/register' component={Register}/>
                    <Route path='/rsvp' component={RSVP}/>
                    <Route path='/invite' component={EventInvitation}/>
                    <Route path='/payment' component={Payment}/>
                    <Route path='/paypalprocess' component={PayPalProcess}/>
                    <Route path='/paymentsuccess' component={PaymentFinish}/>
                    <Route path='/forgetpassword' component={Forgetpassword}/>
                    <Route path='/resetpassword' component={Resetpassword}/>
                    <Route path='/eventlist' component={EventList}/>
                    <Route path='/contactus' component={ContactUs}/>
                    <Route path='/aboutus' component={Aboutus}/>
                    <Route path='/updatepassword' component={UpdatePassword}/>
                    <Route path='/delegation' component={TaskDelegation}/>
                    <Route path='/event/:event_id' component={Event}/>
                    <Route path='/event-create' component={NewEvent}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;

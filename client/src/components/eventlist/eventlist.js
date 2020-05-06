
import React, {Component} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Table from 'react-bootstrap/Table';
import Header from '../header.js';
import Footer from '../footer.js';
import EventTableRow from './eventtableRow';


export default class EventList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000/events/')
      .then(res => {
        this.setState({
          events: res.data
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  DataTable() {
    return this.state.events.map((res, i) => {
      return <eventtableRow obj={res} key={i} />;
    });
  }



  render() {
    return (<div>
      <Header/>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          
        </tr>
      </thead>
      <tbody>
        {this.DataTable()}
      </tbody>
    </Table>
    <Footer/>
  </div>);

  }

}